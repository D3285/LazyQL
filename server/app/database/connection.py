from app.models.database import DatabaseConfig

from .base import DatabaseAdapter
from .postgres import PostgreSQLAdapter
from .sqlite import SQLiteAdapter


def create_database_adapter(
    config: DatabaseConfig,
) -> DatabaseAdapter:

    if config.database_type == "sqlite":
        return SQLiteAdapter(config.connection_url)

    if config.database_type == "postgresql":
        return PostgreSQLAdapter(config.connection_url)

    raise ValueError(
        f"Unsupported database type: {config.database_type}"
    )