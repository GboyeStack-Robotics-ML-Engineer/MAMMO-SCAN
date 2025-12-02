from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, Relationship
from datetime import datetime

class Analysis(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patient.id")
    patient: "Patient" = Relationship(back_populates="analyses")
    date: datetime = Field(default_factory=datetime.utcnow)
    result: str
    confidence: float
    status: str

class MammogramImage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patient.id")
    file_path: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    patient: "Patient" = Relationship(back_populates="images")

class Patient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int
    lastScan: str
    totalScans: int
    status: str
    riskLevel: str
    avatar: Optional[str] = None
    analyses: list["Analysis"] = Relationship(back_populates="patient")
    images: list["MammogramImage"] = Relationship(back_populates="patient")

sqlite_file_name = "database.sqlite"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)