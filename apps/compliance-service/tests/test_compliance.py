from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_compliance():
    payload = {
        "studentId": "1234567890",
        "type": "background_check",
        "status": "pending",
    }
    response = client.post("/compliance", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["studentId"] == "1234567890"
    assert data["type"] == "background_check"
    assert "id" in data


def test_list_compliance():
    response = client.get("/compliance")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_by_student():
    client.post("/compliance", json={
        "studentId": "abc", "type": "policy_acceptance"
    })
    response = client.get("/compliance/student/abc")
    assert response.status_code == 200
    assert len(response.json()) == 1