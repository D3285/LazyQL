"""
schemas.py
----------
Defines the structured data shapes Person 1's AI service uses internally
and returns to Person 2 (Backend). Using dataclasses keeps this dependency-free,
but these map 1:1 onto simple JSON.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Optional, Literal

Operation = Literal["SELECT", "INSERT", "UPDATE", "DELETE", "OTHER"]
DatabaseType = Literal["postgres", "sqlite"]


@dataclass
class SQLResult:
    """
    The structured object returned by generate_sql() / correct_sql().
    This is the contract handed to Person 2 (Backend).
    """
    sql: str
    operation: Operation
    explanation: str
    confidence: float = 0.0
    raw_model_output: Optional[str] = None  # kept for debugging, not required by contract

    def to_dict(self) -> dict:
        # Backend-facing contract only needs sql / operation / explanation,
        # but we include confidence too since it's cheap and useful.
        return {
            "sql": self.sql,
            "operation": self.operation,
            "explanation": self.explanation,
            "confidence": self.confidence,
        }


@dataclass
class Message:
    """A single turn in the conversation."""
    role: Literal["user", "assistant"]
    content: str


@dataclass
class Conversation:
    """
    Rolling conversation history. Kept intentionally lightweight —
    we do NOT store the schema or DB contents here, only prior
    user/assistant turns, so prompts stay small.
    """
    messages: List[Message] = field(default_factory=list)

    def add_user(self, content: str):
        self.messages.append(Message(role="user", content=content))

    def add_assistant(self, content: str):
        self.messages.append(Message(role="assistant", content=content))

    def recent(self, n: int = 4) -> List[Message]:
        """Return only the last n messages (default 4 = 2 turns) to keep prompts small."""
        return self.messages[-n:]

    def as_prompt_block(self, n: int = 4) -> str:
        """Render recent history as plain text for prompt injection."""
        lines = []
        for m in self.recent(n):
            speaker = "User" if m.role == "user" else "Assistant"
            lines.append(f"{speaker}: {m.content}")
        return "\n".join(lines) if lines else "(no prior context)"


@dataclass
class SchemaTable:
    name: str
    columns: List[str]  # e.g. ["id INTEGER PRIMARY KEY", "name VARCHAR"]


@dataclass
class SchemaRelationship:
    from_table_column: str  # e.g. "employees.department_id"
    to_table_column: str    # e.g. "departments.id"


@dataclass
class Schema:
    tables: List[SchemaTable]
    relationships: List[SchemaRelationship] = field(default_factory=list)

    def as_prompt_block(self) -> str:
        """Render the schema as the plain-text block the LLM expects."""
        lines = []
        for t in self.tables:
            lines.append(f"TABLE {t.name}")
            for col in t.columns:
                lines.append(f"  {col}")
            lines.append("")  # blank line between tables
        if self.relationships:
            lines.append("Relationship:")
            for r in self.relationships:
                lines.append(f"{r.from_table_column} -> {r.to_table_column}")
        return "\n".join(lines).strip()
