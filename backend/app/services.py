from __future__ import annotations

from io import BytesIO
from typing import List

import numpy as np
import pandas as pd
from fastapi import HTTPException

REQUIRED_COLUMNS = [
    "fecha",
    "turno",
    "horas_operativas",
    "produccion",
    "meta_produccion",
    "costo_total",
    "detenciones",
    "tiempo_detencion",
    "incidentes",
]

NUMERIC_COLUMNS = [
    "horas_operativas",
    "produccion",
    "meta_produccion",
    "costo_total",
    "detenciones",
    "tiempo_detencion",
    "incidentes",
]


def parse_and_validate_csv(file_bytes: bytes, filename: str) -> pd.DataFrame:
    if not filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="El archivo debe estar en formato CSV.")

    try:
        df = pd.read_csv(BytesIO(file_bytes))
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail="No fue posible leer el CSV. Verifique el formato.") from exc

    if df.empty:
        raise HTTPException(status_code=400, detail="El archivo CSV está vacío.")

    missing_columns = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail=f"Faltan columnas obligatorias: {', '.join(missing_columns)}",
        )

    critical_columns = REQUIRED_COLUMNS
    if df[critical_columns].isnull().any().any():
        raise HTTPException(status_code=400, detail="Existen valores nulos en campos críticos obligatorios.")

    df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce")
    if df["fecha"].isnull().any():
        raise HTTPException(status_code=400, detail="La columna 'fecha' contiene valores no interpretables.")

    for col in NUMERIC_COLUMNS:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        if df[col].isnull().any():
            raise HTTPException(status_code=400, detail=f"La columna '{col}' debe contener valores numéricos.")

    if (df["horas_operativas"] <= 0).any():
        raise HTTPException(status_code=400, detail="'horas_operativas' debe ser mayor a 0 en todos los registros.")

    if (df["produccion"] < 0).any() or (df["meta_produccion"] < 0).any():
        raise HTTPException(status_code=400, detail="'produccion' y 'meta_produccion' no pueden ser negativas.")

    if (df["tiempo_detencion"] < 0).any():
        raise HTTPException(status_code=400, detail="'tiempo_detencion' no puede ser negativo.")

    if (df["incidentes"] < 0).any() or (df["detenciones"] < 0).any():
        raise HTTPException(status_code=400, detail="'incidentes' y 'detenciones' no pueden ser negativos.")

    return df.sort_values("fecha").reset_index(drop=True)


def _safe_divide(numerator: float, denominator: float) -> float:
    return float(numerator / denominator) if denominator else 0.0


def analyze_operational_data(df: pd.DataFrame) -> dict:
    df = df.copy()
    df["eficiencia_operacional"] = df["produccion"] / df["horas_operativas"]
    df["cumplimiento_meta"] = np.where(df["meta_produccion"] > 0, df["produccion"] / df["meta_produccion"], 0)
    df["costo_unitario"] = np.where(df["produccion"] > 0, df["costo_total"] / df["produccion"], 0)
    df["tasa_detencion"] = df["tiempo_detencion"] / df["horas_operativas"]

    eficiencia_prom = float(df["eficiencia_operacional"].mean())
    cumplimiento_prom = float(df["cumplimiento_meta"].mean())
    costo_unitario_prom = float(df["costo_unitario"].mean())
    tasa_detencion_prom = float(df["tasa_detencion"].mean())
    indice_incidentes = _safe_divide(float(df["incidentes"].sum()), float(len(df)))

    produccion_promedio_turno = (
        df.groupby("turno", as_index=True)["produccion"].mean().round(2).to_dict()
    )

    daily = df.groupby(df["fecha"].dt.date, as_index=False).agg(
        produccion=("produccion", "sum"),
        costo_total=("costo_total", "sum"),
        meta_produccion=("meta_produccion", "sum"),
        eficiencia_operacional=("eficiencia_operacional", "mean"),
    )
    daily = daily.sort_values("fecha")
    daily["variacion_pct"] = daily["produccion"].pct_change().fillna(0) * 100
    daily["cumplimiento_meta"] = np.where(
        daily["meta_produccion"] > 0, daily["produccion"] / daily["meta_produccion"], 0
    )

    variacion_diaria = [
        {"fecha": str(row.fecha), "variacion_pct": round(float(row.variacion_pct), 2)}
        for row in daily.itertuples(index=False)
    ]

    eficiencia_turno = (
        df.groupby("turno", as_index=False)["eficiencia_operacional"].mean().sort_values("eficiencia_operacional")
    )
    peor_turno = str(eficiencia_turno.iloc[0]["turno"]) if not eficiencia_turno.empty else None

    p25_prod = float(df["produccion"].quantile(0.25))
    dias_criticos = (
        df.loc[df["produccion"] <= p25_prod, "fecha"].dt.strftime("%Y-%m-%d").unique().tolist()
    )

    alerts: List[str] = []
    if eficiencia_prom < 0.8:
        alerts.append("Alerta crítica: la eficiencia operacional promedio está por debajo de 0.80.")
    if cumplimiento_prom < 0.9:
        alerts.append("Desviación relevante: el cumplimiento de meta promedio está por debajo de 0.90.")

    det_prom = float(df["detenciones"].mean())
    rows_over_det = int((df["detenciones"] > det_prom).sum())
    if rows_over_det > 0:
        alerts.append(
            f"Problema operativo: {rows_over_det} registros tienen detenciones sobre el promedio del período ({det_prom:.2f})."
        )

    turno_lower = df["turno"].astype(str).str.lower()
    night_mask = turno_lower.str.contains("noche")
    day_mask = turno_lower.str.contains("dia") | turno_lower.str.contains("día")
    if night_mask.any() and day_mask.any():
        eff_night = float(df.loc[night_mask, "eficiencia_operacional"].mean())
        eff_day = float(df.loc[day_mask, "eficiencia_operacional"].mean())
        if eff_night < eff_day:
            alerts.append("Alerta comparativa: la eficiencia del turno noche es menor al turno día.")

    if (df["incidentes"] > 0).any():
        alerts.append("Alerta de seguridad: se registraron incidentes en el período analizado.")

    if int((df["tasa_detencion"] > tasa_detencion_prom).sum()) > 0:
        alerts.append("Riesgo operativo: se detectaron registros con tasa de detención superior al promedio del período.")

    recommendations: List[str] = []
    if any("detenciones" in alert for alert in alerts):
        recommendations.append("Revisar causas raíz de detenciones recurrentes y priorizar acciones correctivas por equipo.")
    if any("turno noche" in alert.lower() for alert in alerts):
        recommendations.append("Reforzar control operacional y asignación de recursos durante el turno noche.")
    if cumplimiento_prom < 0.9:
        recommendations.append("Ajustar planificación de recursos en jornadas bajo meta para recuperar cumplimiento semanal.")
    if (df["incidentes"] > 0).any():
        recommendations.append("Monitorear incidentes y su impacto productivo, integrando medidas preventivas de seguridad.")
    if not recommendations:
        recommendations.append("Mantener el plan operacional actual y sostener monitoreo preventivo de KPIs.")

    summary_parts = [
        f"Se analizaron {len(df)} registros entre {df['fecha'].min().date()} y {df['fecha'].max().date()}.",
        f"La eficiencia operacional promedio fue {eficiencia_prom:.2f} y el cumplimiento de meta {cumplimiento_prom:.2f}.",
    ]
    if peor_turno:
        summary_parts.append(f"El turno con menor eficiencia fue '{peor_turno}'.")
    if alerts:
        summary_parts.append(f"Se identificaron {len(alerts)} alertas operativas relevantes.")
    if dias_criticos:
        summary_parts.append(
            "Días críticos de bajo rendimiento detectados: " + ", ".join(dias_criticos[:5]) + ("..." if len(dias_criticos) > 5 else "") + "."
        )

    response = {
        "summary": " ".join(summary_parts),
        "kpis": {
            "eficiencia_operacional": round(eficiencia_prom, 4),
            "cumplimiento_meta": round(cumplimiento_prom, 4),
            "costo_unitario": round(costo_unitario_prom, 4),
            "tasa_detencion": round(tasa_detencion_prom, 4),
            "indice_incidentes": round(indice_incidentes, 4),
            "produccion_promedio_turno": produccion_promedio_turno,
            "variacion_diaria_produccion": variacion_diaria,
            "tendencia_eficiencia": [
                {"fecha": str(row.fecha), "eficiencia": round(float(row.eficiencia_operacional), 4)}
                for row in daily.itertuples(index=False)
            ],
            "desviacion_estandar_produccion": round(float(df["produccion"].std(ddof=0)), 4),
            "peor_turno": peor_turno,
            "dias_criticos_bajo_rendimiento": dias_criticos,
        },
        "alerts": alerts,
        "recommendations": recommendations,
        "charts_data": {
            "produccion_por_dia": [
                {"fecha": str(row.fecha), "produccion": round(float(row.produccion), 2)}
                for row in daily.itertuples(index=False)
            ],
            "eficiencia_por_turno": [
                {"turno": str(row.turno), "eficiencia": round(float(row.eficiencia_operacional), 4)}
                for row in eficiencia_turno.itertuples(index=False)
            ],
            "costos": [
                {"fecha": str(row.fecha), "costo_total": round(float(row.costo_total), 2)}
                for row in daily.itertuples(index=False)
            ],
            "cumplimiento_meta_diario": [
                {"fecha": str(row.fecha), "cumplimiento": round(float(row.cumplimiento_meta), 4)}
                for row in daily.itertuples(index=False)
            ],
        },
        "table_preview": [
            {
                "fecha": row.fecha.strftime("%Y-%m-%d"),
                "turno": str(row.turno),
                "horas_operativas": round(float(row.horas_operativas), 2),
                "produccion": round(float(row.produccion), 2),
                "meta_produccion": round(float(row.meta_produccion), 2),
                "costo_total": round(float(row.costo_total), 2),
                "detenciones": int(row.detenciones),
                "tiempo_detencion": round(float(row.tiempo_detencion), 2),
                "incidentes": int(row.incidentes),
            }
            for row in df.head(15).itertuples(index=False)
        ],
    }

    return response
