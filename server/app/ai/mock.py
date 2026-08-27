class MockAIService:

    def generate_sql(
        self,
        question: str,
        schema: dict,
    ) -> dict:

        return {
            "sql": (
                "SELECT name, salary "
                "FROM employees "
                "ORDER BY salary DESC;"
            ),
            "explanation": (
                "Retrieves employees and sorts "
                "them by salary from highest to lowest."
            ),
            "confidence": 0.95,
        }