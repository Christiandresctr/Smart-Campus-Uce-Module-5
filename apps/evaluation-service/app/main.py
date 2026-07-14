from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, schemas, services
from .database import engine, get_db

app = FastAPI(
    title="Evaluation Service",
    description="Evaluation management for internships",
    version="1.0.0",
)


@app.on_event("startup")
def startup():
    models.Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/evaluations", response_model=schemas.EvaluationResponse, status_code=201)
def create(data: schemas.EvaluationCreate, db: Session = Depends(get_db)):
    return services.create_evaluation(db, data)


@app.get("/evaluations", response_model=list[schemas.EvaluationResponse])
def list_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return services.get_evaluations(db, skip, limit)


@app.get("/evaluations/{eval_id}", response_model=schemas.EvaluationResponse)
def get_one(eval_id: int, db: Session = Depends(get_db)):
    result = services.get_evaluation(db, eval_id)
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return result


@app.get("/evaluations/student/{student_id}", response_model=list[schemas.EvaluationResponse])
def by_student(student_id: str, db: Session = Depends(get_db)):
    return services.get_evaluations_by_student(db, student_id)


@app.get("/evaluations/internship/{internship_id}", response_model=list[schemas.EvaluationResponse])
def by_internship(internship_id: str, db: Session = Depends(get_db)):
    return services.get_evaluations_by_internship(db, internship_id)