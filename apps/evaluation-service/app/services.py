from sqlalchemy.orm import Session
from . import models, schemas


def create_evaluation(db: Session, data: schemas.EvaluationCreate):
    db_eval = models.Evaluation(**data.model_dump())
    db.add(db_eval)
    db.commit()
    db.refresh(db_eval)
    return db_eval


def get_evaluations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Evaluation).offset(skip).limit(limit).all()


def get_evaluation(db: Session, eval_id: int):
    return db.query(models.Evaluation).filter(models.Evaluation.id == eval_id).first()


def get_evaluations_by_student(db: Session, student_id: str):
    return db.query(models.Evaluation).filter(models.Evaluation.studentId == student_id).all()


def get_evaluations_by_internship(db: Session, internship_id: str):
    return db.query(models.Evaluation).filter(models.Evaluation.internshipId == internship_id).all()