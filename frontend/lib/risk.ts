export function riskTrafficLight(score: number) {
  if (score >= 70) return { label: "Alto", color: "bg-red-500" };
  if (score >= 45) return { label: "Medio", color: "bg-amber-400" };
  return { label: "Bajo", color: "bg-emerald-500" };
}
