from .base import DatabaseAdapter
from .sqlite import SQLiteAdapter


def create_database_adapter(
    database_type: str,
    connection_url: str,
) -> DatabaseAdapter:

    if database_type == "sqlite":
        return SQLiteAdapter(connection_url)

    raise ValueError(
        f"Unsupported database type: {database_type}"
    )