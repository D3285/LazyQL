from app.database.sqlite import SQLiteAdapter


def test_sqlite_schema_contains_tables(sqlite_database):
    db = SQLiteAdapter(str(sqlite_database))

    db.connect()

    schema = db.get_schema()

    assert len(schema.tables) > 0

    table_names = [
        table.name
        for table in schema.tables
    ]

    assert "employees" in table_names
    assert "departments" in table_names

    db.close()


def test_schema_contains_foreign_keys(sqlite_database):
    db = SQLiteAdapter(str(sqlite_database))

    db.connect()

    schema = db.get_schema()

    employees = next(
        table
        for table in schema.tables
        if table.name == "employees"
    )

    assert len(employees.foreign_keys) == 1

    foreign_key = employees.foreign_keys[0]

    assert foreign_key.column == "department_id"
    assert foreign_key.references_table == "departments"
    assert foreign_key.references_column == "id"

    db.close()