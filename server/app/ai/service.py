from typing import Protocol


class AIService(Protocol):

    def generate_sql(
        self,
        question: str,
        schema: dict,
    ) -> dict:
        ...