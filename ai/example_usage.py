"""
example_usage.py
-----------------
Demonstrates how Person 2 (Backend) would call this AI service.
Run this directly to sanity-check the whole pipeline:

    python example_usage.py

By default this uses MockLLMClient (no local model required) so you can
verify the plumbing works before Ollama/your model is set up. Switch to
the real client by uncommenting the line marked below.
"""

from ai_service import AIService
from llm_client import MockLLMClient  # , OllamaClient
from schemas import Schema, SchemaTable, SchemaRelationship, Conversation


def build_example_schema() -> Schema:
    return Schema(
        tables=[
            SchemaTable(
                name="departments",
                columns=["id INTEGER PRIMARY KEY", "name VARCHAR"],
            ),
            SchemaTable(
                name="employees",
                columns=[
                    "id INTEGER PRIMARY KEY",
                    "name VARCHAR",
                    "salary NUMERIC",
                    "department_id INTEGER",
                ],
            ),
        ],
        relationships=[
            SchemaRelationship("employees.department_id", "departments.id"),
        ],
    )


def main():
    # --- swap this for OllamaClient(model="sqlcoder") once your local model is running ---
    service = AIService(llm_client=MockLLMClient())

    schema = build_example_schema()
    conversation = Conversation()

    print("=== 1. Natural language -> SQL ===")
    result = service.generate_sql(
        question="Show the top 5 highest paid engineers.",
        schema=schema,
        database_type="postgres",
        conversation=conversation,
    )
    print(result.to_dict())

    print("\n=== 2. Error correction ===")
    corrected = service.correct_sql(
        original_sql="SELECT employee_name FROM employees;",
        db_error='column "employee_name" does not exist',
        schema=schema,
        database_type="postgres",
    )
    print(corrected.to_dict())

    print("\n=== 3. SQL explanation ===")
    explanation = service.explain_sql(
        sql="SELECT e.name, e.salary FROM employees e JOIN departments d "
            "ON e.department_id = d.id WHERE d.name = 'Engineering' "
            "ORDER BY e.salary DESC LIMIT 5;",
        schema=schema,
        database_type="postgres",
    )
    print(explanation)

    print("\n=== 4. Auto-correction loop (simulated backend execution) ===")

    attempt_counter = {"n": 0}

    def fake_execute(sql: str):
        """Simulates Backend running SQL against a real DB. Fails once, then succeeds."""
        attempt_counter["n"] += 1
        if attempt_counter["n"] == 1:
            raise RuntimeError('column "employee_name" does not exist')
        print(f"  (simulated) executed successfully: {sql}")

    final_result = service.run_with_auto_correction(
        question="List employee names.",
        schema=schema,
        database_type="postgres",
        execute_fn=fake_execute,
    )
    print(final_result.to_dict())

    print("\n=== 5. Conversation context ===")
    print(conversation.as_prompt_block())


if __name__ == "__main__":
    main()
