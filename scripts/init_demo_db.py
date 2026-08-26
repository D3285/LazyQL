import sqlite3
from pathlib import Path


DATABASE_PATH = (
    Path(__file__).resolve().parents[1]
    / "database"
    / "samples"
    / "company.db"
)


def create_database():
    DATABASE_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    connection = sqlite3.connect(DATABASE_PATH)

    cursor = connection.cursor()

    cursor.execute(
        """
        DROP TABLE IF EXISTS employees
        """
    )

    cursor.execute(
        """
        DROP TABLE IF EXISTS departments
        """
    )

    cursor.execute(
        """
        CREATE TABLE departments (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )
        """
    )

    cursor.execute(
        """
        CREATE TABLE employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            salary INTEGER NOT NULL,
            department_id INTEGER,
            FOREIGN KEY (department_id)
                REFERENCES departments(id)
        )
        """
    )

    cursor.executemany(
        """
        INSERT INTO departments (name)
        VALUES (?)
        """,
        [
            ("Engineering",),
            ("HR",),
            ("Finance",),
        ],
    )

    cursor.executemany(
        """
        INSERT INTO employees (
            name,
            salary,
            department_id
        )
        VALUES (?, ?, ?)
        """,
        [
            ("Rahul", 1000000, 1),
            ("Amit", 1200000, 1),
            ("Priya", 1500000, 2),
        ],
    )

    connection.commit()
    connection.close()

    print(f"Demo database created at: {DATABASE_PATH}")


if __name__ == "__main__":
    create_database()