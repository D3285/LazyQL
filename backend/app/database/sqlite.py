from sqlalchemy import create_engine, text
from .schema import extract_schema
from .base import DatabaseAdapter


class SQLiteAdapter(DatabaseAdapter):

    def __init__(self, database_path: str):
        self.database_path = database_path
        self.engine = None

    def connect(self) -> bool:
        self.engine = create_engine(
            f"sqlite:///{self.database_path}"
        )

        with self.engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return True

    def get_schema(self):
      if self.engine is None:
          self.connect()

      return extract_schema(self.engine)

    def execute_query(self, sql: str):
        if self.engine is None:
            raise RuntimeError("Database is not connected")

        with self.engine.connect() as connection:
            result = connection.execute(text(sql))

            columns = list(result.keys())
            rows = result.fetchall()

            return {
                "columns": columns,
                "rows": rows,
            }

    def close(self):
        if self.engine:
            self.engine.dispose()
            self.engine = None