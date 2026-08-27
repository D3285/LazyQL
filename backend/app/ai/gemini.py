import json
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()


class GeminiService:

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured."
            )

        self.client = genai.Client(
            api_key=api_key
        )

        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-2.5-flash-lite",
        )

    def generate_sql(
        self,
        question: str,
        schema: dict,
    ) -> dict:

        schema_text = json.dumps(
            schema,
            indent=2,
        )

        prompt = f"""
You are LazyQL, an AI SQL assistant.

Convert the user's natural-language question
into a SQL query using ONLY the provided database schema.

STRICT RULES:

1. Use ONLY tables present in the schema.
2. Use ONLY columns present in the schema.
3. NEVER invent a table.
4. NEVER invent a column.
5. Generate READ-ONLY SQL only.
6. Never use INSERT, UPDATE, DELETE, DROP,
   ALTER, CREATE, TRUNCATE, or other destructive SQL.
7. The SQL must be valid for the database type.
8. Give a short explanation.
9. Give a confidence score between 0 and 1.
10. Return ONLY valid JSON.

Expected JSON:

{{
    "sql": "SELECT ...;",
    "explanation": "Short explanation.",
    "confidence": 0.95
}}

DATABASE SCHEMA:

{schema_text}

USER QUESTION:

{question}
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

        text = response.text.strip()

        # Remove markdown fences if Gemini returns them
        if text.startswith("```"):
            text = text.strip("`")

            if text.startswith("json"):
                text = text[4:].strip()

        try:
            result = json.loads(text)

        except json.JSONDecodeError as exc:
            raise RuntimeError(
                "Gemini returned invalid JSON."
            ) from exc

        sql = result.get("sql")

        if not sql:
            raise RuntimeError(
                "Gemini did not return SQL."
            )

        explanation = result.get(
            "explanation",
            "SQL query generated successfully.",
        )

        try:
            confidence = float(
                result.get("confidence", 0.5)
            )
        except (TypeError, ValueError):
            confidence = 0.5

        confidence = max(
            0.0,
            min(1.0, confidence),
        )

        return {
            "sql": sql.strip(),
            "explanation": explanation.strip(),
            "confidence": confidence,
        }