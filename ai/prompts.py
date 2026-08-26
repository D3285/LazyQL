"""
prompts.py
----------
All prompt templates live here, separated from logic, so they're easy to
tune during the hackathon without touching the service code.

We maintain separate instructions per dialect (Postgres vs SQLite) since
LIMIT/OFFSET, date functions, type names, and quoting rules can differ.
"""

DIALECT_NOTES = {
    "postgres": (
        "Dialect notes: Use PostgreSQL syntax. Use double quotes only for "
        "case-sensitive identifiers. LIMIT/OFFSET is supported. Use "
        "NUMERIC/INTEGER/VARCHAR/TIMESTAMP types. ILIKE is available for "
        "case-insensitive matching."
    ),
    "sqlite": (
        "Dialect notes: Use SQLite syntax. SQLite is dynamically typed "
        "(type names are advisory). LIMIT/OFFSET is supported but OFFSET "
        "requires LIMIT. There is no ILIKE — use LIKE with LOWER() for "
        "case-insensitive matching. No RIGHT/FULL OUTER JOIN support."
    ),
}

SYSTEM_INSTRUCTIONS = (
    "You are an SQL generation assistant. You convert natural language "
    "requests into a single valid SQL query for the given schema and "
    "dialect. Respond with STRICT JSON only, no markdown fences, no prose "
    "outside the JSON, matching exactly this shape:\n"
    '{{"sql": "<the SQL query>", "operation": "SELECT|INSERT|UPDATE|DELETE|OTHER", '
    '"explanation": "<one sentence plain-English explanation>", '
    '"confidence": <float between 0 and 1>}}\n'
    "Only reference tables/columns that exist in the schema below. "
    "Never invent columns."
)


def build_generation_prompt(
    question: str,
    schema_block: str,
    database_type: str,
    conversation_block: str = "(no prior context)",
) -> str:
    """Main prompt for turning a natural-language question into SQL."""
    dialect_note = DIALECT_NOTES.get(database_type, DIALECT_NOTES["postgres"])
    return f"""{SYSTEM_INSTRUCTIONS}

Database dialect: {database_type}
{dialect_note}

Schema:
{schema_block}

Conversation so far (most recent first is at the bottom):
{conversation_block}

User request:
"{question}"

Respond with the JSON object now.
"""


def build_correction_prompt(
    original_sql: str,
    db_error: str,
    schema_block: str,
    database_type: str,
) -> str:
    """Prompt used when the Backend reports a database execution error."""
    dialect_note = DIALECT_NOTES.get(database_type, DIALECT_NOTES["postgres"])
    return f"""{SYSTEM_INSTRUCTIONS}

Database dialect: {database_type}
{dialect_note}

Schema:
{schema_block}

The following SQL was generated but failed when executed:

Generated SQL:
{original_sql}

Database error:
{db_error}

Fix the SQL using the schema and the database error above.
Return only the corrected SQL, in the same JSON shape as before.
"""


def build_explanation_prompt(sql: str, schema_block: str, database_type: str) -> str:
    """Prompt for the 'explain this query' feature."""
    return f"""You are an SQL explanation assistant. Explain in plain English
what the following {database_type} SQL query does, in 1-3 sentences,
for a non-technical audience. Do not restate the raw SQL syntax verbatim.

Schema:
{schema_block}

SQL:
{sql}

Respond with STRICT JSON only, no markdown fences:
{{"explanation": "<your explanation here>"}}
"""
