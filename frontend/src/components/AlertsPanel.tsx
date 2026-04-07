interface Props {
  alerts: string[];
}

export function AlertsPanel({ alerts }: Props) {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <h3 className="text-lg font-semibold text-amber-800">Alertas detectadas</h3>
      {alerts.length === 0 ? (
        <p className="mt-2 text-sm text-amber-700">Sin alertas críticas para el período cargado.</p>
      ) : (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
          {alerts.map((alert) => (
            <li key={alert}>{alert}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
