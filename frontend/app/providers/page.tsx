import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEMO_ROLES, DemoRole } from "@/lib/roles";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProvidersPage({ searchParams }: Props) {
  const params = await searchParams;
  const roleParam = typeof params.role === "string" ? params.role : "executive";
  const role = (DEMO_ROLES.includes(roleParam as DemoRole) ? roleParam : "executive") as DemoRole;

  const offers = await prisma.supplierOffer.findMany({ orderBy: [{ assetId: "asc" }, { unitPriceUsd: "asc" }] });

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-6">
      <Link href={`/?role=${role}`} className="text-sm text-mine-accent">← Volver al dashboard</Link>
      <h1 className="text-2xl font-bold">Comparador de proveedores</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-2">Activo</th>
              <th className="pb-2">Proveedor</th>
              <th className="pb-2">SKU</th>
              <th className="pb-2">Precio USD</th>
              <th className="pb-2">Lead time</th>
              <th className="pb-2">Calidad</th>
              <th className="pb-2">Garantía</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className="border-t border-slate-800">
                <td className="py-2">{offer.assetId}</td>
                <td>{offer.supplier}</td>
                <td>{offer.sku}</td>
                <td>{offer.unitPriceUsd.toLocaleString()}</td>
                <td>{offer.leadTimeDays} días</td>
                <td>{offer.qualityScore}/100</td>
                <td>{offer.warrantyMonths} meses</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
