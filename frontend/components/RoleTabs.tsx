import Link from "next/link";
import { DemoRole, DEMO_ROLES, roleDescriptions, roleLabels } from "@/lib/roles";

export function RoleTabs({ activeRole }: { activeRole: DemoRole }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-400">Rol demo activo</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {DEMO_ROLES.map((role) => (
          <Link
            key={role}
            href={`/?role=${role}`}
            className={`rounded-full px-3 py-2 text-sm transition ${
              role === activeRole ? "bg-mine-accent text-slate-950" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            {roleLabels[role]}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-300">{roleDescriptions[activeRole]}</p>
    </div>
  );
}
