from app.database.session import DatabaseSessionManager
from app.database.sqlite import SQLiteAdapter


def test_create_and_get_session(tmp_path):
    manager = DatabaseSessionManager()

    adapter = SQLiteAdapter(
        str(tmp_path / "test.db")
    )

    adapter.connect()

    session_id = manager.create_session(adapter)

    assert session_id

    stored_adapter = manager.get_session(
        session_id
    )

    assert stored_adapter is adapter

    manager.close_session(session_id)


def test_unknown_session():
    manager = DatabaseSessionManager()

    try:
        manager.get_session("does-not-exist")
        assert False
    except KeyError:
        assert True

def test_close_session_removes_session(tmp_path):
    manager = DatabaseSessionManager()

    adapter = SQLiteAdapter(
        str(tmp_path / "test.db")
    )

    adapter.connect()

    session_id = manager.create_session(adapter)

    manager.close_session(session_id)

    try:
        manager.get_session(session_id)
        assert False
    except KeyError:
        assert True