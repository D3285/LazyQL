import pytest

from app.database.exceptions import DatabaseConnectionError
from app.database.sqlite import SQLiteAdapter



def test_sqlite_connection(sqlite_database):
    db = SQLiteAdapter(str(sqlite_database))

    assert db.connect() is True

    db.close()

def test_sqlite_invalid_connection():
    db = SQLiteAdapter(
        "Z:/this/path/does/not/exist/database.db"
    )

    with pytest.raises(DatabaseConnectionError):
        db.connect()
    
def test_sqlite_query_execution(sqlite_database):
    db = SQLiteAdapter(str(sqlite_database))

    db.connect()

    result = db.execute_query(
        "SELECT name, salary FROM employees ORDER BY salary DESC"
    )

    assert result["columns"] == ["name", "salary"]

    assert result["rows"] == [
        ["Priya", 1500000],
        ["Amit", 1200000],
        ["Rahul", 1000000],
    ]

    db.close()