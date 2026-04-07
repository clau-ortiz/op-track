import { useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { AlertsPanel } from './components/AlertsPanel';
import { ChartsPanel } from './components/ChartsPanel';
import { KPICard } from './components/KPICard';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { getTemplateUrl, uploadAndAnalyze } from './lib/api';
import { AnalysisResponse } from './types';

const REQUIRED_HEADERS = [
  'fecha',
  'turno',
  'horas_operativas',
  'produccion',
  'meta_produccion',
  'costo_total',
  'detenciones',
  'tiempo_detencion',
  'incidentes'
];

function App() {
  const [dragging, setDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const onFileSelected = async (file: File) => {
    setError(null);
    setAnalysis(null);

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Debe seleccionar un archivo CSV válido.');
      return;
    }

    const text = await file.text();
    const [headerLine] = text.split('\n');
    const headers = headerLine.split(',').map((h) => h.trim());
    const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      setError(`El archivo no contiene todas las columnas requeridas. Faltan: ${missing.join(', ')}`);
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    try {
      const data = await uploadAndAnalyze(file);
      setAnalysis(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      setError(axiosError.response?.data?.detail ?? 'No se pudo procesar el archivo.');
    } finally {
      setIsLoading(false);
    }
  };

  const previewRows = useMemo(() => analysis?.table_preview ?? [], [analysis]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">OpTrack</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-900">Sistema de Control Operacional</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Plataforma de análisis operacional para cargar datos productivos, validar estructura, detectar desviaciones
            y generar recomendaciones ejecutables para supervisión y control de gestión.
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Carga de archivo operacional</h2>
          <p className="mt-1 text-sm text-slate-600">
            Arrastre su CSV o selecciónelo manualmente. El sistema valida estructura y reglas antes del análisis.
          </p>

          <div
            className={`mt-4 rounded-xl border-2 border-dashed p-8 text-center transition ${
              dragging ? 'border-slate-700 bg-slate-100' : 'border-slate-300'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                void onFileSelected(file);
              }
            }}
          >
            <p className="text-sm text-slate-700">Suelte aquí su archivo CSV</p>
            <label className="mt-4 inline-flex cursor-pointer rounded-md bg-brand-900 px-4 py-2 text-sm font-medium text-white">
              Seleccionar archivo
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void onFileSelected(file);
                  }
                }}
              />
            </label>
            <div className="mt-4">
              <a href={getTemplateUrl()} className="text-sm font-medium text-brand-700 underline">
                Descargar plantilla modelo CSV
              </a>
            </div>
          </div>
          {fileName ? <p className="mt-2 text-sm text-slate-500">Archivo cargado: {fileName}</p> : null}
          {isLoading ? <p className="mt-2 text-sm text-slate-600">Procesando análisis operacional...</p> : null}
          {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}
        </section>

        {analysis ? (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Resultados del análisis</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard title="Eficiencia operacional" value={analysis.kpis.eficiencia_operacional.toFixed(2)} />
                <KPICard title="Cumplimiento de meta" value={`${(analysis.kpis.cumplimiento_meta * 100).toFixed(1)}%`} />
                <KPICard title="Costo unitario" value={analysis.kpis.costo_unitario.toFixed(2)} />
                <KPICard title="Tasa de detención" value={analysis.kpis.tasa_detencion.toFixed(2)} />
                <KPICard title="Índice de incidentes" value={analysis.kpis.indice_incidentes.toFixed(2)} />
                <KPICard title="Peor turno" value={analysis.kpis.peor_turno ?? 'N/A'} />
                <KPICard
                  title="Desv. estándar producción"
                  value={analysis.kpis.desviacion_estandar_produccion.toFixed(2)}
                />
                <KPICard title="Días críticos" value={analysis.kpis.dias_criticos_bajo_rendimiento.length.toString()} />
              </div>
            </section>

            <ChartsPanel data={analysis.charts_data} />

            <section className="grid gap-4 lg:grid-cols-2">
              <AlertsPanel alerts={analysis.alerts} />
              <RecommendationsPanel recommendations={analysis.recommendations} />
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Reporte ejecutivo</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{analysis.summary}</p>
              <p className="mt-3 rounded-md bg-slate-100 p-3 text-xs text-slate-600">
                Preparado para exportación PDF en versión siguiente (estructura de reporte implementada).
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Vista previa de datos</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {Object.keys(previewRows[0] ?? {}).map((key) => (
                        <th key={key} className="px-3 py-2 text-left font-semibold text-slate-600">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {previewRows.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val, valIdx) => (
                          <td key={valIdx} className="whitespace-nowrap px-3 py-2 text-slate-700">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default App;
