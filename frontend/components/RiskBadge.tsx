import { riskTrafficLight } from "@/lib/risk";

export function RiskBadge({ score }: { score: number }) {
  const risk = riskTrafficLight(score);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs">
      <span className={`h-2.5 w-2.5 rounded-full ${risk.color}`} />
      {risk.label} ({score})
    </span>
  );
}
