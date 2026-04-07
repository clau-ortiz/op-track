import Link from "next/link";
import { redirect } from "next/navigation";
import { KpiCard } from "@/components/KpiCard";
import { RiskBadge } from "@/components/RiskBadge";
import { RoleTabs } from "@/components/RoleTabs";
import { findAssetId, getDashboardData } from "@/lib/data";
import { DEMO_ROLES, DemoRole } from "@/lib/roles";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const roleParam = typeof params.role === "string" ? params.role : "executive";
  const role = (DEMO_ROLES.includes(roleParam as DemoRole) ? roleParam : "executive") as DemoRole;
  const lookup = typeof params.lookup === "string" ? params.lookup : "";

  if (lookup) {
    const match = await findAssetId(lookup);
    if (match) {
      redirect(`/assets/${match.id}?role=${role}`);
    }
  }

  const { assets, suppliers, kpis } = await getDashboardData(role);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="rounded-2xl border border-slate-800 bg-gradient-to-r from-mine-900 to-mine-700 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-300">MineAsset Tracker</p>
        <h1 className="mt-2 text-3xl font-bold">Gestión de activos críticos mineros</h1>
        <p className="mt-2 text-slate-300">Fase 1: dashboard operativo con datos demo, trazabilidad y vista por rol.</p>
      </header>

      <RoleTabs activeRole={role} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Activos totales" value={kpis.totalAssets} />
        <KpiCard label="Riesgo alto" value={kpis.highRiskAssets} />
        <KpiCard label="Alertas de stock" value={kpis.stockAlerts} />
        <KpiCard label="Servicios próximos" value={kpis.upcomingServices} />
        <KpiCard label="Lead time promedio" value={`${kpis.avgLeadTime} días`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Inventario técnico</h2>
            <form className="flex gap-2" action="/">
              <input type="hidden" name="role" value={role} />
              <input
                name="lookup"
                placeholder="Buscar por ID de activo"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
              <button className="rounded-lg bg-mine-accent px-3 py-2 text-sm font-medium text-slate-950">Buscar</button>
            </form>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="pb-2">Activo</th>
                  <th className="pb-2">Estado</th>
                  <th className="pb-2">Stock</th>
                  <th className="pb-2">Riesgo</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-t border-slate-800">
                    <td className="py-3">
                      <Link href={`/assets/${asset.id}?role=${role}`} className="font-medium text-slate-100 hover:text-mine-accent">
                        {asset.id} · {asset.name}
                      </Link>
                    </td>
                    <td>{asset.status}</td>
                    <td>
                      {asset.stock}/{asset.minStock}
                    </td>
                    <td>
                      <RiskBadge score={asset.riskScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold">Comparación de proveedores</h2>
          <p className="mt-1 text-sm text-slate-400">Top cotizaciones para evaluación inicial.</p>
          <ul className="mt-4 space-y-3 text-sm">
            {suppliers.slice(0, 5).map((offer) => (
              <li key={offer.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <p className="font-medium">{offer.supplier}</p>
                <p className="text-slate-400">{offer.assetId}</p>
                <p className="mt-1">USD {offer.unitPriceUsd.toLocaleString()} · {offer.leadTimeDays} días</p>
              </li>
            ))}
          </ul>
          <Link href={`/providers?role=${role}`} className="mt-4 inline-block text-sm text-mine-accent">
            Ver comparador completo →
          </Link>
        </article>
      </section>
    </main>
  );
}
