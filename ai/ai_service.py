"""
ai_service.py
--------------
This is Person 1's deliverable: the AI Service API.
Person 2 (Backend) should only ever need to import from this file.

Public contract:

    generate_sql(question, schema, database_type, conversation=None) -> SQLResult
    correct_sql(original_sql, db_error, schema, database_type, attempt=1) -> SQLResult
    explain_sql(sql, schema, database_type) -> str
    run_with_auto_correction(question, schema, database_type, execute_fn, conversation=None) -> SQLResult

Nothing here opens a database connection. `execute_fn` (used only in the
optional auto-correction loop) is passed in BY the backend, so Person 1's
code never talks to Postgres/SQLite directly.
"""

import json
import re
from typing import Optional, Callable

from schemas import SQLResult, Schema, Conversation, Operation
from llm_client import LLMClient, get_default_client
from prompts import (
    build_generation_prompt,
    build_correction_prompt,
    build_explanation_prompt,
)

MAX_CORRECTION_ATTEMPTS = 3  # hard cap so the AI<->DB error loop can't run forever


class AIService:
    def __init__(self, llm_client: Optional[LLMClient] = None):
        # Swap the model by passing a different LLMClient in here.
        # The rest of the app never needs to know what changed.
        self.llm = llm_client or get_default_client()

    # ---- low-level: the one function everything else is built on ----
    def generate_sql_raw(self, prompt: str) -> str:
        """generate_sql(prompt: str) -> str, as specified in the requirements."""
        return self.llm.complete(prompt)

    # ---- high-level: natural language -> structured SQL result ----
    def generate_sql(
        self,
        question: str,
        schema: Schema,
        database_type: str = "postgres",
        conversation: Optional[Conversation] = None,
    ) -> SQLResult:
        schema_block = schema.as_prompt_block()
        conversation_block = conversation.as_prompt_block() if conversation else "(no prior context)"

        prompt = build_generation_prompt(
            question=question,
            schema_block=schema_block,
            database_type=database_type,
            conversation_block=conversation_block,
        )
        raw = self.generate_sql_raw(prompt)
        result = _parse_structured_response(raw)

        if conversation is not None:
            conversation.add_user(question)
            conversation.add_assistant(result.sql)

        return result

    # ---- error correction loop ----
    def correct_sql(
        self,
        original_sql: str,
        db_error: str,
        schema: Schema,
        database_type: str = "postgres",
    ) -> SQLResult:
        schema_block = schema.as_prompt_block()
        prompt = build_correction_prompt(
            original_sql=original_sql,
            db_error=db_error,
            schema_block=schema_block,
            database_type=database_type,
        )
        raw = self.generate_sql_raw(prompt)
        return _parse_structured_response(raw)

    def run_with_auto_correction(
        self,
        question: str,
        schema: Schema,
        database_type: str,
        execute_fn: Callable[[str], None],
        conversation: Optional[Conversation] = None,
        max_attempts: int = MAX_CORRECTION_ATTEMPTS,
    ) -> SQLResult:
        """
        Convenience orchestrator implementing the loop:
            AI -> SQL -> Backend -> Database -> ERROR -> AI -> corrected SQL ...

        `execute_fn` is supplied BY the backend (e.g. a function that runs the
        SQL against Postgres/SQLite and raises an exception with the DB error
        message on failure). Person 1's code never connects to a database
        itself — it just calls whatever execute_fn the backend gives it.

        Capped at `max_attempts` corrections so it can't loop forever.
        """
        result = self.generate_sql(question, schema, database_type, conversation)

        attempts = 0
        last_error: Optional[str] = None
        while attempts < max_attempts:
            try:
                execute_fn(result.sql)
                return result  # success
            except Exception as e:  # noqa: BLE001 - backend defines the real exception type
                last_error = str(e)
                attempts += 1
                result = self.correct_sql(
                    original_sql=result.sql,
                    db_error=last_error,
                    schema=schema,
                    database_type=database_type,
                )

        # Ran out of attempts — return the last attempt so the backend/UI
        # can surface it, rather than raising and crashing the demo.
        result.explanation = (
            f"Could not produce a working query after {max_attempts} attempts. "
            f"Last database error: {last_error}"
        )
        return result

    # ---- SQL explanation feature ----
    def explain_sql(self, sql: str, schema: Schema, database_type: str = "postgres") -> str:
        schema_block = schema.as_prompt_block()
        prompt = build_explanation_prompt(sql, schema_block, database_type)
        raw = self.generate_sql_raw(prompt)
        try:
            parsed = _extract_json(raw)
            return parsed.get("explanation", raw.strip())
        except (ValueError, json.JSONDecodeError):
            # Fall back to raw text if the model didn't return clean JSON
            return raw.strip()


# ---------------------------------------------------------------------
# Helpers: turning raw (possibly messy) model text into a SQLResult
# ---------------------------------------------------------------------

_VALID_OPERATIONS = {"SELECT", "INSERT", "UPDATE", "DELETE", "OTHER"}


def _extract_json(raw: str) -> dict:
    """
    Models sometimes wrap JSON in markdown fences or add stray text.
    This pulls out the first {...} block and parses it.
    """
    text = raw.strip()
    text = re.sub(r"^```(json)?", "", text.strip(), flags=re.IGNORECASE).strip()
    text = re.sub(r"```$", "", text.strip()).strip()

    match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in model output")
    return json.loads(match.group(0))


def _guess_operation(sql: str) -> Operation:
    first_word = sql.strip().split(None, 1)[0].upper() if sql.strip() else ""
    return first_word if first_word in _VALID_OPERATIONS else "OTHER"  # type: ignore


def _parse_structured_response(raw: str) -> SQLResult:
    """
    Turn the model's raw text into a SQLResult, tolerating models that
    don't perfectly follow the "strict JSON only" instruction.
    """
    try:
        data = _extract_json(raw)
        sql = data.get("sql", "").strip()
        operation = data.get("operation") or _guess_operation(sql)
        if operation not in _VALID_OPERATIONS:
            operation = _guess_operation(sql)
        explanation = data.get("explanation", "").strip()
        confidence = float(data.get("confidence", 0.5))
        return SQLResult(
            sql=sql,
            operation=operation,  # type: ignore
            explanation=explanation,
            confidence=confidence,
            raw_model_output=raw,
        )
    except (ValueError, json.JSONDecodeError, TypeError):
        # Model didn't return valid JSON at all — fall back to treating
        # the whole response as raw SQL text so the pipeline doesn't crash.
        cleaned = raw.strip().strip("`")
        return SQLResult(
            sql=cleaned,
            operation=_guess_operation(cleaned),
            explanation="(model did not return structured output; raw text used as-is)",
            confidence=0.3,
            raw_model_output=raw,
        )


# ---------------------------------------------------------------------
# Module-level convenience functions matching the exact API contract
# requested: generate_sql(question, schema, database_type, conversation)
# ---------------------------------------------------------------------

_default_service: Optional[AIService] = None


def _service() -> AIService:
    global _default_service
    if _default_service is None:
        _default_service = AIService()
    return _default_service


def generate_sql(
    question: str,
    schema: Schema,
    database_type: str = "postgres",
    conversation: Optional[Conversation] = None,
) -> SQLResult:
    return _service().generate_sql(question, schema, database_type, conversation)


def correct_sql(
    original_sql: str,
    db_error: str,
    schema: Schema,
    database_type: str = "postgres",
) -> SQLResult:
    return _service().correct_sql(original_sql, db_error, schema, database_type)


def explain_sql(sql: str, schema: Schema, database_type: str = "postgres") -> str:
    return _service().explain_sql(sql, schema, database_type)
