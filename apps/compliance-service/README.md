
### 2. compliance-service 

```markdown
# Compliance Service

## What is it?
Microservice for managing student compliance requirements before starting an internship. Tracks background checks, document verification, and policy acceptance.

## Tech Stack
- **Runtime:** Python 3.12 (FastAPI)
- **Database:** MongoDB 7
- **ODM:** PyMongo
- **Docs:** Swagger (auto, `/docs`)

## Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/compliance` | Create a compliance record |
| GET | `/compliance` | List all records |
| GET | `/compliance/{id}` | Get record by ID |
| GET | `/compliance/student/{studentId}` | Records by student |
| PATCH | `/compliance/{id}` | Update status/notes |
| DELETE | `/compliance/{id}` | Delete record |

## Compliance Types

| Type | Description |
|---|---|
| `background_check` | Background verification |
| `document_verification` | Document review |
| `policy_acceptance` | Policy agreement |

## Statuses

- `pending` — Awaiting review
- `approved` — Compliant
- `rejected` — Non-compliant

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| MONGO_URI | `mongodb://localhost:27018/compliance_db` | MongoDB connection |

## How to run locally

```bash
# 1. Start MongoDB
docker run -d -p 27018:27017 --name compliance-db mongo:7

# 2. Create venv and install deps
cd apps/compliance-service
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 3. Start service
uvicorn app.main:app --reload --port 3010

# 4. Open Swagger
# http://localhost:3010/docs
Example flow
# Create a compliance check
curl -X POST http://localhost:3010/compliance \
  -H "Content-Type: application/json" \
  -d '{"studentId": "1234567890", "type": "background_check"}'

# Approve it
curl -X PATCH http://localhost:3010/compliance/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

# List by student
curl http://localhost:3010/compliance/student/1234567890
Dependencies
MongoDB 7
Tests
cd apps/compliance-service
.venv\Scripts\Activate.ps1
pip install pytest httpx
pytest tests/ -v