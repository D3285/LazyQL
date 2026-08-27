from sqlalchemy import create_engine, text
from .schema import extract_schema
from .base import DatabaseAdapter
from .exceptions import DatabaseConnectionError

class SQLiteAdapter(DatabaseAdapter):

    def __init__(self, database_path: str):
        self.database_path = database_path
        self.engine = None

    def connect(self) -> bool:
      try:
          self.engine = create_engine(
              f"sqlite:///{self.database_path}"
          )

          with self.engine.connect() as connection:
              connection.execute(text("SELECT 1"))

          return True

      except Exception as exc:
          self.engine = None
          raise DatabaseConnectionError(
              "Unable to connect to SQLite database"
          ) from exc

    def get_schema(self):
      if self.engine is None:
          self.connect()

      return extract_schema(
          self.engine,
          "sqlite"
      )

    def execute_query(self, sql: str):
      if self.engine is None:
          raise RuntimeError(
              "Database is not connected"
          )

      with self.engine.begin() as connection:
          result = connection.execute(text(sql))

          columns = list(result.keys())
          rows = [
              list(row)
              for row in result.fetchall()
          ]

          return {
              "columns": columns,
              "rows": rows,
          }

    def close(self):
        if self.engine:
            self.engine.dispose()
            self.engine = None
            
            