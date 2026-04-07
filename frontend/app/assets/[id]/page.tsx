import Link from "next/link";
import { notFound } from "next/navigation";
import { RiskBadge } from "@/components/RiskBadge";
import { getAssetDetail } from "@/lib/data";
import { DEMO_ROLES, DemoRole } from "@/lib/roles";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AssetDetailPage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const roleParam = typeof query.role === "string" ? query.role : "executive";
  const role = (DEMO_ROLES.includes(roleParam as DemoRole) ? roleParam : "executive") as DemoRole;
  const asset = await getAssetDetail(id, role);

  if (!asset) notFound();

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <Link href={`/?role=${role}`} className="text-sm text-mine-accent">← Volver al dashboard</Link>
      <header className="card">
        <p className="text-xs text-slate-400">{asset.id}</p>
        <h1 className="text-2xl font-bold">{asset.name}</h1>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-300">
          <span>{asset.category}</span>
          <span>·</span>
          <span>{asset.location}</span>
          <span>·</span>
          <span>{asset.status}</span>
          <RiskBadge score={asset.riskScore} />
        </div>
        <p className="mt-3 text-sm text-slate-300">{asset.technicalNotes}</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card">
          <h2 className="text-lg font-semibold">Historial de cambios</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {asset.changes.length === 0 && <li className="text-slate-500">Sin registros visibles para este rol.</li>}
            {asset.changes.map((change) => (
              <li key={change.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="font-medium">{change.field}: {change.previous} → {change.next}</p>
                <p className="text-slate-400">{change.reason} · {change.changedBy}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold">Historial de mantenimiento</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {asset.maintenances.length === 0 && <li className="text-slate-500">Sin mantenimientos visibles para este rol.</li>}
            {asset.maintenances.map((maintenance) => (
              <li key={maintenance.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="font-medium">{maintenance.type} · {maintenance.status}</p>
                <p className="text-slate-400">{maintenance.notes}</p>
                <p className="text-slate-500">USD {maintenance.costUsd.toLocaleString()} · {maintenance.performedBy}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <article className="card">
        <h2 className="text-lg font-semibold">Opciones de reposición</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="pb-2">Proveedor</th>
                <th className="pb-2">Precio USD</th>
                <th className="pb-2">Lead time</th>
                <th className="pb-2">Calidad</th>
                <th className="pb-2">Garantía</th>
              </tr>
            </thead>
            <tbody>
              {asset.suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-t border-slate-800">
                  <td className="py-2">{supplier.supplier}</td>
                  <td>{supplier.unitPriceUsd.toLocaleString()}</td>
                  <td>{supplier.leadTimeDays} días</td>
                  <td>{supplier.qualityScore}/100</td>
                  <td>{supplier.warrantyMonths} meses</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </main>
  );
}
