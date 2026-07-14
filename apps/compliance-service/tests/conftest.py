import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import collection

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_db():
    collection.delete_many({})
    yield
    collection.delete_many({})