export const DEMO_ROLES = ["executive", "maintenance", "procurement", "operations"] as const;

export type DemoRole = (typeof DEMO_ROLES)[number];

export const roleLabels: Record<DemoRole, string> = {
  executive: "Ejecutivo",
  maintenance: "Mantenimiento",
  procurement: "Abastecimiento",
  operations: "Operaciones"
};

export const roleDescriptions: Record<DemoRole, string> = {
  executive: "Vista global de criticidad, costos y cumplimiento.",
  maintenance: "Detalle técnico, historial y próximos mantenimientos.",
  procurement: "Comparación de proveedores y riesgo de reposición.",
  operations: "Disponibilidad operacional y estado diario de activos."
};
