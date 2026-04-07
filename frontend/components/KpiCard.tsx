export function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="card">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-mine-accent">{value}</p>
    </article>
  );
}
