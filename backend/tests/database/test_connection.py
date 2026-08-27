import pytest
from unittest.mock import patch

from sqlalchemy.exc import OperationalError
from app.database.connection import create_database_adapter
from app.database.sqlite import SQLiteAdapter
from app.models.database import DatabaseConfig
from app.database.postgres import PostgreSQLAdapter
from app.database.exceptions import DatabaseConnectionError


def test_create_sqlite_adapter(sqlite_database):
    config = DatabaseConfig(
        database_type="sqlite",
        connection_url=str(sqlite_database),
    )

    adapter = create_database_adapter(config)

    assert isinstance(adapter, SQLiteAdapter)

    adapter.close()


def test_unsupported_database_type():
    config = DatabaseConfig(
        database_type="mongodb",
        connection_url="some-connection",
    )

    with pytest.raises(ValueError):
        create_database_adapter(config)
        
def test_create_postgresql_adapter():
    config = DatabaseConfig(
        database_type="postgresql",
        connection_url="postgresql+psycopg://test:test@localhost:5432/test",
    )

    adapter = create_database_adapter(config)

    assert isinstance(adapter, PostgreSQLAdapter)

    adapter.close()
    
    
def test_postgresql_connection_error():
    config = DatabaseConfig(
        database_type="postgresql",
        connection_url=(
            "postgresql+psycopg://invalid:invalid@"
            "localhost:5432/test"
        ),
    )

    adapter = create_database_adapter(config)

    with patch(
        "app.database.postgres.create_engine"
    ) as mock_create_engine:

        mock_engine = mock_create_engine.return_value

        mock_engine.connect.side_effect = OperationalError(
            "connection failed",
            None,
            Exception("database unavailable"),
        )

        with pytest.raises(DatabaseConnectionError):
            adapter.connect()
    