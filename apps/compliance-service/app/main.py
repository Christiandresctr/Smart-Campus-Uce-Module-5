from fastapi import FastAPI, HTTPException
from . import schemas, services

app = FastAPI(
    title="Compliance Service",
    description="Compliance and policy acceptance management",
    version="1.0.0",
    root_path="/compliance",
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/compliance", response_model=schemas.ComplianceResponse, status_code=201)
def create(data: schemas.ComplianceCreate):
    return services.create_compliance(data.model_dump())


@app.get("/compliance", response_model=list[schemas.ComplianceResponse])
def list_all(skip: int = 0, limit: int = 100):
    return services.get_compliances(skip, limit)


@app.get("/compliance/{id}", response_model=schemas.ComplianceResponse)
def get_one(id: str):
    result = services.get_compliance(id)
    if not result:
        raise HTTPException(status_code=404, detail="Compliance not found")
    return result


@app.get("/compliance/student/{student_id}", response_model=list[schemas.ComplianceResponse])
def by_student(student_id: str):
    return services.get_compliances_by_student(student_id)


@app.patch("/compliance/{id}", response_model=schemas.ComplianceResponse)
def update(id: str, data: schemas.ComplianceUpdate):
    result = services.update_compliance(id, data.model_dump(exclude_unset=True))
    if not result:
        raise HTTPException(status_code=404, detail="Compliance not found")
    return result


@app.delete("/compliance/{id}")
def delete(id: str):
    result = services.delete_compliance(id)
    if not result:
        raise HTTPException(status_code=404, detail="Compliance not found")
    return {"message": "Deleted"}