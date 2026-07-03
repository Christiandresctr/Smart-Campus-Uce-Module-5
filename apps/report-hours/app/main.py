from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi.responses import JSONResponse
from . import models, schemas, services
from .database import engine, get_db


models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Report Hours Service",
    description="Consolidación de horas de pasantías y generación de certificados",
    version="1.0.0",
)

@app.post("/students", response_model=schemas.StudentCreate)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    services.validar_cedula(student.student_id)
    db_student = models.Student(**student.model_dump())
    try:
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        return db_student
    except IntegrityError:
        db.rollback()
        return JSONResponse(
            status_code=409,
            content={"detail": "El estudiante con esta cédula ya existe"},
        )


@app.get("/students/{cedula}", response_model=schemas.StudentCreate)
def get_student(cedula: str, db: Session = Depends(get_db)):
    return services.obtener_estudiante(db, cedula)

@app.get("/report/hours/{cedula}", response_model=schemas.HourSummary)
def get_hours(cedula: str, db: Session = Depends(get_db)):
    services.obtener_estudiante(db, cedula)
    return services.get_hour_summary(db, cedula)


@app.post("/report/certificate", response_model=schemas.CertificateResponse)
def generate_certificate(req: schemas.CertificateRequest, db: Session = Depends(get_db)):
    return services.generate_certificate(db, req.student_id)


@app.post("/hours", response_model=schemas.HourLogCreate)
def add_hours(hours: schemas.HourLogCreate, db: Session = Depends(get_db)):
    services.obtener_estudiante(db, hours.student_id)
    db_hours = models.HourLog(**hours.model_dump())
    db.add(db_hours)
    db.commit()
    db.refresh(db_hours)
    return db_hours


@app.get("/health")
def health():
    return {"status": "ok"}