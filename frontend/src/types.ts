export interface KPIResponse {
  eficiencia_operacional: number;
  cumplimiento_meta: number;
  costo_unitario: number;
  tasa_detencion: number;
  indice_incidentes: number;
  produccion_promedio_turno: Record<string, number>;
  variacion_diaria_produccion: Array<{ fecha: string; variacion_pct: number }>;
  tendencia_eficiencia: Array<{ fecha: string; eficiencia: number }>;
  desviacion_estandar_produccion: number;
  peor_turno: string | null;
  dias_criticos_bajo_rendimiento: string[];
}

export interface ChartsData {
  produccion_por_dia: Array<{ fecha: string; produccion: number }>;
  eficiencia_por_turno: Array<{ turno: string; eficiencia: number }>;
  costos: Array<{ fecha: string; costo_total: number }>;
  cumplimiento_meta_diario: Array<{ fecha: string; cumplimiento: number }>;
}

export interface AnalysisResponse {
  summary: string;
  kpis: KPIResponse;
  alerts: string[];
  recommendations: string[];
  charts_data: ChartsData;
  table_preview: Array<Record<string, string | number>>;
}
