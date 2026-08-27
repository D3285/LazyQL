import sqlite3

import pytest


@pytest.fixture
def sqlite_database(tmp_path):
    database_path = tmp_path / "test.db"

    connection = sqlite3.connect(database_path)
    
    connection.execute(
        """
        CREATE TABLE departments (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )
        """
    )
    
    connection.execute(
        """
        INSERT INTO departments (name)
        VALUES
            ('Engineering'),
            ('HR'),
            ('Finance')
        """
    )

    connection.execute(
        """
        CREATE TABLE employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            salary INTEGER NOT NULL,
            department_id INTEGER,
            FOREIGN KEY (department_id) REFERENCES departments(id)
        )
        """
    )

    connection.execute(
        """
        INSERT INTO employees (name, salary, department_id)
        VALUES
            ('Rahul', 1000000, 1),
            ('Amit', 1200000, 1),
            ('Priya', 1500000, 2)
        """
    )

    connection.commit()
    connection.close()

    return database_path