from sqlalchemy import create_engine, text  # type: ignore[reportMissingImports]

from .base import DatabaseAdapter


class PostgreSQLAdapter(DatabaseAdapter):

    def __init__(self, connection_url: str):
        self.connection_url = connection_url
        self.engine = None

    def connect(self) -> bool:
        self.engine = create_engine(self.connection_url)

        with self.engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return True

    def get_schema(self):
        pass

    def execute_query(self, sql: str):
        pass

    def close(self):
        if self.engine:
            self.engine.dispose()