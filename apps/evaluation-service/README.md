# Evaluation Service

## What is it?
Microservice for managing internship evaluations. Allows evaluators to score student performance during their internship with a rating from 1 to 10 and comments.

## Tech Stack
- **Runtime:** Python 3.12 (FastAPI)
- **Database:** PostgreSQL 16
- **ORM:** SQLAlchemy 2.0
- **Docs:** Swagger (auto, `/docs`)

## Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/evaluations` | Create an evaluation |
| GET | `/evaluations` | List all evaluations |
| GET | `/evaluations/{id}` | Get evaluation by ID |
| GET | `/evaluations/student/{studentId}` | Evaluations by student |
| GET | `/evaluations/internship/{internshipId}` | Evaluations by internship |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| DATABASE_URL | `postgresql://user:pass@localhost:5437/evaluation_db` | PostgreSQL connection |

## How to run locally

```bash
# 1. Start PostgreSQL
docker run -d -p 5437:5432 --name evaluation-db \
  -e POSTGRES_DB=evaluation_db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=pass \
  postgres:16-alpine

# 2. Create virtual env and install deps
cd apps/evaluation-service
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 3. Start service
uvicorn app.main:app --reload --port 3009

# 4. Open Swagger
# http://localhost:3009/docs

How to use
Create an evaluation
POST /evaluations
{
  "studentId": "1234567890",
  "companyId": "company-1",
  "internshipId": "internship-1",
  "score": 8,
  "comments": "Good performance"
}
List evaluations by student
GET /evaluations/student/1234567890
List evaluations by internship
GET /evaluations/internship/internship-1
Dependencies
evaluation-db (PostgreSQL)
Tests
cd apps/evaluation-service
.venv\Scripts\Activate.ps1
pip install pytest httpx
pytest tests/ -v
Example flow
Create evaluation with POST /evaluations
List by student with GET /evaluations/student/{studentId}
List by internship with GET /evaluations/internship/{internshipId}