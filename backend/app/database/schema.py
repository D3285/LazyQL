from sqlalchemy import inspect

from app.models.schema import DatabaseSchema


def extract_schema(engine, database_type: str) -> DatabaseSchema:
    inspector = inspect(engine)

    tables = []

    for table_name in inspector.get_table_names():
        columns = []

        for column in inspector.get_columns(table_name):
            columns.append({
                "name": column["name"],
                "type": str(column["type"]),
                "primary_key": column.get("primary_key", False),
            })

        foreign_keys = []

        for foreign_key in inspector.get_foreign_keys(table_name):
            constrained_columns = foreign_key.get(
                "constrained_columns", []
            )

            referred_columns = foreign_key.get(
                "referred_columns", []
            )

            for column, referred_column in zip(
                constrained_columns,
                referred_columns
            ):
                foreign_keys.append({
                    "column": column,
                    "references_table": foreign_key["referred_table"],
                    "references_column": referred_column,
                })

        tables.append({
            "name": table_name,
            "columns": columns,
            "foreign_keys": foreign_keys,
        })

    return DatabaseSchema(
        database_type=database_type,
        tables=tables,
    )