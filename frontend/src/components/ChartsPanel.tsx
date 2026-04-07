import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { ChartsData } from '../types';

interface Props {
  data: ChartsData;
}

export function ChartsPanel({ data }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">Producción por día</h4>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data.produccion_por_dia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="produccion" stroke="#0f172a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">Eficiencia por turno</h4>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={data.eficiencia_por_turno}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="turno" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="eficiencia" fill="#1e293b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">Costos diarios</h4>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data.costos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="costo_total" stroke="#334155" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">Cumplimiento de meta diario</h4>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={data.cumplimiento_meta_diario}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cumplimiento" fill="#475569" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}
