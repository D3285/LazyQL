from app.database.sqlite import SQLiteAdapter


def test_sqlite_schema_contains_tables(sqlite_database):
    db = SQLiteAdapter(str(sqlite_database))

    db.connect()

    schema = db.get_schema()

    assert len(schema) > 0

    table_names = [table["name"] for table in schema]

    assert "employees" in table_names

    db.close()
    
def test_schema_contains_foreign_keys(sqlite_database):
    db = SQLiteAdapter(str(sqlite_database))

    db.connect()

    schema = db.get_schema()

    employees = next(
        table for table in schema
        if table["name"] == "employees"
    )

    assert employees["foreign_keys"] == [
        {
            "column": "department_id",
            "references_table": "departments",
            "references_column": "id",
        }
    ]

    db.close()