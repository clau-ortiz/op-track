import { PrismaClient, RoleScope } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.changeLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.supplierOffer.deleteMany();
  await prisma.asset.deleteMany();

  const assets = [
    {
      id: "TRK-TIRE-001",
      name: "Neumático de camión minero",
      category: "Movilidad pesada",
      location: "Pit Norte",
      status: "Operativo",
      stock: 12,
      minStock: 8,
      riskScore: 35,
      nextServiceDate: new Date("2026-05-15"),
      criticality: "Alta",
      replacementLeadDays: 18,
      technicalNotes: "Control de presión diario y análisis de temperatura por turno."
    },
    {
      id: "HYD-PUMP-014",
      name: "Bomba hidráulica",
      category: "Sistema hidráulico",
      location: "Planta chancado",
      status: "Operativo",
      stock: 4,
      minStock: 5,
      riskScore: 72,
      nextServiceDate: new Date("2026-04-21"),
      criticality: "Crítica",
      replacementLeadDays: 32,
      technicalNotes: "Presenta vibración intermitente sobre 1.2 mm/s."
    },
    {
      id: "ELE-MOTOR-032",
      name: "Motor eléctrico industrial",
      category: "Accionamiento",
      location: "Molienda primaria",
      status: "Observación",
      stock: 3,
      minStock: 2,
      riskScore: 58,
      nextServiceDate: new Date("2026-04-29"),
      criticality: "Alta",
      replacementLeadDays: 40,
      technicalNotes: "Incremento térmico de 8% respecto al promedio mensual."
    },
    {
      id: "CB-BELT-020",
      name: "Correa transportadora",
      category: "Transporte",
      location: "Línea 2",
      status: "Operativo",
      stock: 7,
      minStock: 6,
      riskScore: 44,
      nextServiceDate: new Date("2026-05-05"),
      criticality: "Media",
      replacementLeadDays: 25,
      technicalNotes: "Revisar tensión y alineamiento cada 15 días."
    },
    {
      id: "FLT-IND-011",
      name: "Filtro industrial",
      category: "Filtrado",
      location: "Tratamiento de agua",
      status: "Operativo",
      stock: 16,
      minStock: 10,
      riskScore: 27,
      nextServiceDate: new Date("2026-06-02"),
      criticality: "Media",
      replacementLeadDays: 12,
      technicalNotes: "Sin hallazgos críticos en último ciclo."
    },
    {
      id: "BRK-CMP-007",
      name: "Componente de freno",
      category: "Seguridad",
      location: "Taller central",
      status: "Observación",
      stock: 5,
      minStock: 7,
      riskScore: 81,
      nextServiceDate: new Date("2026-04-18"),
      criticality: "Crítica",
      replacementLeadDays: 21,
      technicalNotes: "Fatiga detectada en 2/5 inspecciones del último mes."
    }
  ];

  for (const asset of assets) {
    await prisma.asset.create({ data: asset });
  }

  await prisma.changeLog.createMany({
    data: [
      {
        assetId: "HYD-PUMP-014",
        changedBy: "Ing. Moreno",
        field: "Estado",
        previous: "Operativo",
        next: "Operativo con alerta",
        reason: "Desviación de vibración",
        createdAt: new Date("2026-04-02"),
        visibility: RoleScope.MAINTENANCE
      },
      {
        assetId: "BRK-CMP-007",
        changedBy: "Supervisor P. Rojas",
        field: "Stock mínimo",
        previous: "5",
        next: "7",
        reason: "Ajuste por criticidad de seguridad",
        createdAt: new Date("2026-04-03"),
        visibility: RoleScope.EXECUTIVE
      },
      {
        assetId: "TRK-TIRE-001",
        changedBy: "Analista S. Díaz",
        field: "Ubicación",
        previous: "Pit Sur",
        next: "Pit Norte",
        reason: "Reasignación operacional",
        createdAt: new Date("2026-03-27"),
        visibility: RoleScope.OPERATIONS
      }
    ]
  });

  await prisma.maintenanceLog.createMany({
    data: [
      {
        assetId: "HYD-PUMP-014",
        performedBy: "Téc. Fuentes",
        type: "Predictivo",
        status: "Pendiente",
        notes: "Programar cambio de sello mecánico",
        costUsd: 4200,
        performedAt: new Date("2026-04-06"),
        visibility: RoleScope.MAINTENANCE
      },
      {
        assetId: "ELE-MOTOR-032",
        performedBy: "Téc. Mella",
        type: "Preventivo",
        status: "Completado",
        notes: "Lubricación y calibración de rodamientos",
        costUsd: 1850,
        performedAt: new Date("2026-03-30"),
        visibility: RoleScope.OPERATIONS
      },
      {
        assetId: "BRK-CMP-007",
        performedBy: "Téc. Araya",
        type: "Correctivo",
        status: "En curso",
        notes: "Reemplazo parcial de compuesto",
        costUsd: 2900,
        performedAt: new Date("2026-04-05"),
        visibility: RoleScope.EXECUTIVE
      }
    ]
  });

  await prisma.supplierOffer.createMany({
    data: [
      { assetId: "HYD-PUMP-014", supplier: "HydroAndes", sku: "HA-881", unitPriceUsd: 12800, leadTimeDays: 21, qualityScore: 89, warrantyMonths: 18, lastQuotedAt: new Date("2026-04-01") },
      { assetId: "HYD-PUMP-014", supplier: "MinParts", sku: "MP-4420", unitPriceUsd: 11750, leadTimeDays: 29, qualityScore: 82, warrantyMonths: 12, lastQuotedAt: new Date("2026-03-29") },
      { assetId: "BRK-CMP-007", supplier: "SafeBrake", sku: "SB-77", unitPriceUsd: 3400, leadTimeDays: 12, qualityScore: 93, warrantyMonths: 24, lastQuotedAt: new Date("2026-04-04") },
      { assetId: "BRK-CMP-007", supplier: "MetalStop", sku: "MS-207", unitPriceUsd: 2950, leadTimeDays: 20, qualityScore: 80, warrantyMonths: 12, lastQuotedAt: new Date("2026-04-02") },
      { assetId: "TRK-TIRE-001", supplier: "GeoTyre", sku: "GT-OFF900", unitPriceUsd: 9800, leadTimeDays: 17, qualityScore: 87, warrantyMonths: 15, lastQuotedAt: new Date("2026-03-30") }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
