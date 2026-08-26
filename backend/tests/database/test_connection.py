import pytest

from app.database.connection import create_database_adapter
from app.database.sqlite import SQLiteAdapter


def test_create_sqlite_adapter(sqlite_database):
    adapter = create_database_adapter(
        "sqlite",
        str(sqlite_database),
    )

    assert isinstance(adapter, SQLiteAdapter)

    adapter.close()


def test_unsupported_database_type():
    with pytest.raises(ValueError):
        create_database_adapter(
            "mongodb",
            "some-connection",
        )