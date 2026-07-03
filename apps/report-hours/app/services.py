from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from datetime import datetime
from io import BytesIO
import requests

from . import models, schemas
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter


def validar_cedula(cedula: str) -> bool:
    if len(cedula) != 10 or not cedula.isdigit():
        return False
    coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
    total = 0
    for i in range(9):
        v = int(cedula[i]) * coeficientes[i]
        total += v if v < 10 else v - 9
    digito_verificador = 10 - (total % 10)
    if digito_verificador == 10:
        digito_verificador = 0
    return digito_verificador == int(cedula[9])


def obtener_estudiante(db: Session, cedula: str) -> models.Student:
    if not validar_cedula(cedula):
        raise HTTPException(400, "Cédula inválida")
    student = db.query(models.Student).filter(
        models.Student.student_id == cedula
    ).first()
    if not student:
        raise HTTPException(404, "Estudiante no registrado en report-hours")
    return student


def get_hour_summary(db: Session, student_id: str) -> schemas.HourSummary:
    result = db.query(func.sum(models.HourLog.hours)).filter(
        models.HourLog.student_id == student_id
    ).scalar()
    total_hours = result or 0.0
    min_required = 320.0

    return schemas.HourSummary(
        student_id=student_id,
        full_name="",
        total_hours=total_hours,
        min_required=min_required,
        meets_requirement=total_hours >= min_required,
        hours_remaining=max(0.0, min_required - total_hours),
    )


def generate_certificate(db: Session, student_id: str) -> schemas.CertificateResponse:
    summary = get_hour_summary(db, student_id)
    if not summary.meets_requirement:
        raise HTTPException(
            status_code=400,
            detail=f"El estudiante no cumple con las {summary.min_required:.0f} horas mínimas "
                   f"(tiene {summary.total_hours:.0f}, faltan {summary.hours_remaining:.0f})"
        )

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.setTitle(f"Certificado - {student_id}")

    pdf.drawString(100, 750, "UNIVERSIDAD CENTRAL DEL ECUADOR")
    pdf.drawString(100, 730, "CERTIFICADO DE PASANTIAS")
    pdf.drawString(100, 700, f"Estudiante ID: {student_id}")
    pdf.drawString(100, 680, f"Horas completadas: {summary.total_hours:.0f}")
    pdf.drawString(100, 640, f"Fecha: {datetime.now().strftime('%d/%m/%Y')}")
    pdf.save()

    pdf_content = buffer.getvalue()
    buffer.close()

    cert = models.Certificate(
        student_id=student_id,
        total_hours=summary.total_hours,
        status="generated",
        pdf_path=f"/certificates/{student_id}.pdf"
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)

    with open(f"/certificates/{student_id}.pdf", "wb") as f:
        f.write(pdf_content)

    return schemas.CertificateResponse(
        student_id=cert.student_id,
        total_hours=cert.total_hours,
        status=cert.status,
        pdf_url=cert.pdf_path,
        generated_at=cert.generated_at,
    )