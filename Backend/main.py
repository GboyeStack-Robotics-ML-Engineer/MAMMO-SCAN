from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select, SQLModel, Field
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
from pathlib import Path

from database import Patient, Analysis, MammogramImage, engine, create_db_and_tables


class AnalysisRead(SQLModel):
    id: int
    date: datetime
    result: str
    confidence: float
    status: str


class MammogramImageRead(SQLModel):
    id: int
    file_path: str
    uploaded_at: datetime


class PatientDetail(SQLModel):
    id: int
    name: str
    age: int
    lastScan: str
    totalScans: int
    status: str
    riskLevel: str
    avatar: Optional[str] = None
    analyses: List[AnalysisRead] = Field(default_factory=list)
    images: List[MammogramImageRead] = Field(default_factory=list)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_ROOT = BASE_DIR / "uploads"
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_ROOT), name="uploads")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        if not session.exec(select(Analysis)).first():
            # Create some patients first
            patient1 = Patient(name="Sarah Johnson", age=52, lastScan="2025-11-12", totalScans=5, status="Active", riskLevel="Low", avatar="/avatars/01.png")
            patient2 = Patient(name="Maria Garcia", age=48, lastScan="2025-11-12", totalScans=3, status="Pending Review", riskLevel="Moderate", avatar="/avatars/02.png")
            session.add(patient1)
            session.add(patient2)
            session.commit()
            session.refresh(patient1)
            session.refresh(patient2)

            # Now create analyses for them
            analyses = [
                Analysis(patient_id=patient1.id, date=datetime(2025, 11, 12, 9, 15), result="Normal", confidence=98.5, status="Completed"),
                Analysis(patient_id=patient2.id, date=datetime(2025, 11, 12, 8, 45), result="Suspicious", confidence=87.2, status="Pending Review"),
            ]
            for analysis in analyses:
                session.add(analysis)
            session.commit()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/stats")
def get_stats():
    # This can be made dynamic later
    return [
        { "title": "Total Scans", "value": "1,247", "change": "+12.5%" },
        { "title": "Active Patients", "value": "892", "change": "+8.2%" },
        { "title": "Pending Reviews", "value": "23", "change": "-5.1%" },
        { "title": "Detection Rate", "value": "94.8%", "change": "+2.3%" },
    ]

@app.get("/api/recent-analyses", response_model=List[Analysis])
def get_recent_analyses():
    with Session(engine) as session:
        analyses = session.exec(select(Analysis).order_by(Analysis.date.desc())).all()
        return analyses

@app.get("/api/patients", response_model=List[Patient])
def get_patients():
    with Session(engine) as session:
        patients = session.exec(select(Patient)).all()
        return patients


@app.get("/api/patients/{patient_id}", response_model=PatientDetail)
def get_patient_detail(patient_id: int):
    with Session(engine) as session:
        statement = (
            select(Patient)
            .where(Patient.id == patient_id)
            .options(
                selectinload(Patient.analyses),
                selectinload(Patient.images),
            )
        )
        patient = session.exec(statement).one_or_none()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient

@app.post("/api/patients", response_model=Patient)
async def create_patient(
    name: str = Form(...),
    age: int = Form(...),
    lastScan: str = Form(...),
    totalScans: int = Form(...),
    status: str = Form(...),
    riskLevel: str = Form(...),
    images: Optional[List[UploadFile]] = File(default=None),
):
    cleaned_name = name.strip()
    if not cleaned_name:
        raise HTTPException(status_code=422, detail="Patient name is required")

    with Session(engine) as session:
        db_patient = Patient(
            name=cleaned_name,
            age=age,
            lastScan=lastScan,
            totalScans=totalScans,
            status=status,
            riskLevel=riskLevel,
        )
        session.add(db_patient)
        session.commit()
        session.refresh(db_patient)

        files_to_attach = images or []
        if files_to_attach:
            upload_root = UPLOAD_ROOT / "patients" / str(db_patient.id)
            upload_root.mkdir(parents=True, exist_ok=True)

            for index, image in enumerate(files_to_attach):
                file_bytes = await image.read()
                if not file_bytes:
                    await image.close()
                    continue

                original_name = image.filename or f"mammogram_{index}.bin"
                timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
                sanitized_name = original_name.replace(" ", "_")
                file_path = upload_root / f"{timestamp}_{sanitized_name}"
                file_path.write_bytes(file_bytes)

                stored_image = MammogramImage(
                    patient_id=db_patient.id,
                    file_path=f"/uploads/{file_path.relative_to(UPLOAD_ROOT).as_posix()}",
                )
                session.add(stored_image)
                await image.close()

            session.commit()
            session.refresh(db_patient)

        new_analysis = Analysis(
            patient_id=db_patient.id,
            result="Pending",
            confidence=0.0,
            status="Awaiting Scan",
        )
        session.add(new_analysis)
        session.commit()
        session.refresh(db_patient)

        return db_patient


@app.put("/api/patients/{patient_id}", response_model=Patient)
def update_patient(patient_id: str, patient_update: Patient):
    try:
        numeric_id = int(patient_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Patient not found")

    update_data = patient_update.dict(exclude_unset=True)
    update_data.pop("id", None)
    update_data.pop("analyses", None)

    with Session(engine) as session:
        db_patient = session.get(Patient, numeric_id)
        if not db_patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        for key, value in update_data.items():
            setattr(db_patient, key, value)

        session.add(db_patient)
        session.commit()
        session.refresh(db_patient)

        return db_patient


@app.delete("/api/patients/{patient_id}", status_code=204)
def delete_patient(patient_id: str):
    try:
        numeric_id = int(patient_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Patient not found")

    with Session(engine) as session:
        db_patient = session.get(Patient, numeric_id)
        if not db_patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        analyses = session.exec(
            select(Analysis).where(Analysis.patient_id == numeric_id)
        ).all()
        for analysis in analyses:
            session.delete(analysis)

        images = session.exec(
            select(MammogramImage).where(MammogramImage.patient_id == numeric_id)
        ).all()
        for image in images:
            stored_path = image.file_path
            relative = stored_path[9:] if stored_path.startswith("/uploads/") else stored_path
            file_on_disk = UPLOAD_ROOT / relative
            if file_on_disk.exists():
                try:
                    file_on_disk.unlink()
                except OSError:
                    pass
            session.delete(image)

        session.delete(db_patient)
        session.commit()

    return Response(status_code=204)
