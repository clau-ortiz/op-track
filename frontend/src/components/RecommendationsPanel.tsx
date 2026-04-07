interface Props {
  recommendations: string[];
}

export function RecommendationsPanel({ recommendations }: Props) {
  return (
    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <h3 className="text-lg font-semibold text-emerald-800">Recomendaciones accionables</h3>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-emerald-900">
        {recommendations.map((recommendation) => (
          <li key={recommendation}>{recommendation}</li>
        ))}
      </ul>
    </section>
  );
}
