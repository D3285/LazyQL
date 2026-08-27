# Person 1 — AI / Agent Engineer: AI Service

Converts natural language → SQL, using a local LLM, with schema-aware
prompting, dialect handling, structured output, error correction, and
conversation context. Does **not** connect to any database.

## Files

| File | Responsibility |
|---|---|
| `llm_client.py` | The *only* file that knows which model is running. `generate_sql(prompt) -> str` lives here (as `LLMClient.complete`). Swap models by changing `get_default_client()`. |
| `prompts.py` | Prompt templates, separated per dialect (`postgres` / `sqlite`). Tune these without touching logic. |
| `schemas.py` | Data shapes: `SQLResult` (the API contract output), `Schema`, `Conversation`. |
| `ai_service.py` | The public API: `generate_sql`, `correct_sql`, `explain_sql`, `run_with_auto_correction`. **This is what Person 2 imports.** |
| `example_usage.py` | Runnable demo of the whole pipeline using a mock model (no setup needed). |

## Setup

1. Install a local LLM runtime — [Ollama](https://ollama.com) is the fastest for a hackathon:
   ```bash
   ollama serve
   ollama pull sqlcoder      # SQL-specialized model (recommended)
   # or: ollama pull llama3.1
   ```
2. No pip packages are required (stdlib only). If you prefer `requests` over `urllib`, see `requirements.txt`.
3. Run the demo (uses a mock model, no Ollama needed):
   ```bash
   python3 example_usage.py
   ```
4. To use the real model, in your code:
   ```python
   from ai_service import AIService
   from llm_client import OllamaClient

   service = AIService(llm_client=OllamaClient(model="sqlcoder"))
   ```

## API contract (for Person 2 / Backend)

```python
from ai_service import generate_sql, correct_sql, explain_sql
from schemas import Schema, SchemaTable, SchemaRelationship, Conversation

schema = Schema(
    tables=[
        SchemaTable("employees", ["id INTEGER PRIMARY KEY", "name VARCHAR",
                                   "salary NUMERIC", "department_id INTEGER"]),
        SchemaTable("departments", ["id INTEGER PRIMARY KEY", "name VARCHAR"]),
    ],
    relationships=[SchemaRelationship("employees.department_id", "departments.id")],
)

result = generate_sql(
    question="Show the top 5 highest paid engineers.",
    schema=schema,
    database_type="postgres",   # or "sqlite"
    conversation=Conversation(),  # optional, pass the same object across turns
)

result.sql          # "SELECT ..."
result.operation     # "SELECT"
result.explanation   # "Finds the five highest-paid employees..."
result.confidence    # 0.94
result.to_dict()     # {"sql": ..., "operation": ..., "explanation": ...} — send this over the wire
```

### Error correction loop

Backend runs the SQL. If the database throws an error, send it back:

```python
fixed = correct_sql(
    original_sql=result.sql,
    db_error='column "employee_name" does not exist',
    schema=schema,
    database_type="postgres",
)
```

Or let Person 1's service manage retries for you (capped at 3 attempts) by
passing in your own execute function — this is the only place the AI
service ever "touches" the database, and only indirectly through a
function *you* provide:

```python
from ai_service import AIService
service = AIService()

def execute(sql: str):
    cursor.execute(sql)   # your real DB call — raises on failure

final_result = service.run_with_auto_correction(
    question="List employee names.",
    schema=schema,
    database_type="postgres",
    execute_fn=execute,
)
```

### SQL explanation

```python
explain_sql(sql="SELECT ...", schema=schema, database_type="postgres")
# -> "This query joins employees with departments, filters Engineering
#     employees, sorts by salary and returns the top five."
```

## Deliverables checklist

- [x] Local LLM connected (`llm_client.py`, swappable via `LLMClient`)
- [x] Natural language → SQL (`generate_sql`)
- [x] PostgreSQL SQL generation (`prompts.py` dialect templates)
- [x] SQLite SQL generation (`prompts.py` dialect templates)
- [x] Structured output (`SQLResult` / strict JSON contract)
- [x] SQL explanation (`explain_sql`)
- [x] Error correction, capped at 3 attempts (`correct_sql`, `run_with_auto_correction`)
- [x] Conversation context (`Conversation`, kept small — no full DB dump)
- [x] AI service API (`ai_service.py` — the single import point for Backend)
