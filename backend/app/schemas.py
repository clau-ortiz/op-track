from __future__ import annotations

from typing import Dict, List

from pydantic import BaseModel


class KPIResponse(BaseModel):
    eficiencia_operacional: float
    cumplimiento_meta: float
    costo_unitario: float
    tasa_detencion: float
    indice_incidentes: float
    produccion_promedio_turno: Dict[str, float]
    variacion_diaria_produccion: List[Dict[str, float | str]]
    tendencia_eficiencia: List[Dict[str, float | str]]
    desviacion_estandar_produccion: float
    peor_turno: str | None
    dias_criticos_bajo_rendimiento: List[str]


class ChartsDataResponse(BaseModel):
    produccion_por_dia: List[Dict[str, float | str]]
    eficiencia_por_turno: List[Dict[str, float | str]]
    costos: List[Dict[str, float | str]]
    cumplimiento_meta_diario: List[Dict[str, float | str]]


class AnalysisResponse(BaseModel):
    summary: str
    kpis: KPIResponse
    alerts: List[str]
    recommendations: List[str]
    charts_data: ChartsDataResponse
    table_preview: List[Dict[str, float | str | int]]
