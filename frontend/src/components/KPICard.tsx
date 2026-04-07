interface Props {
  title: string;
  value: string;
  subtitle?: string;
}

export function KPICard({ title, value, subtitle }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-semibold text-slate-800">{value}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </article>
  );
}
