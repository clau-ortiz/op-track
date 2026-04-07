from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .schemas import AnalysisResponse
from .services import analyze_operational_data, parse_and_validate_csv

app = FastAPI(title="OpTrack API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/template")
def download_template() -> FileResponse:
    template_path = Path(__file__).resolve().parents[2] / "data" / "sample_operacional.csv"
    return FileResponse(
        path=template_path,
        media_type="text/csv",
        filename="plantilla_optrack.csv",
    )


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)) -> dict:
    content = await file.read()
    df = parse_and_validate_csv(content, file.filename or "")
    return analyze_operational_data(df)
