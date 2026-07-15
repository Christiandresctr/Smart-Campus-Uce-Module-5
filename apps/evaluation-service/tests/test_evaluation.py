from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_evaluation():
    payload = {
        "studentId": "1234567890",
        "companyId": "company-1",
        "internshipId": "internship-1",
        "score": 8,
        "comments": "Good performance",
    }
    response = client.post("/evaluations", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["studentId"] == "1234567890"
    assert data["score"] == 8
    assert "id" in data


def test_list_evaluations():
    response = client.get("/evaluations")
    assert response.status_code == 200
    assert isinstance(response.json(), list)