import { RoleScope } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DemoRole } from "@/lib/roles";

const roleScopeByDemo: Record<DemoRole, RoleScope> = {
  executive: RoleScope.EXECUTIVE,
  maintenance: RoleScope.MAINTENANCE,
  procurement: RoleScope.PROCUREMENT,
  operations: RoleScope.OPERATIONS
};

export async function getDashboardData(role: DemoRole) {
  const [assets, maintenances, suppliers] = await Promise.all([
    prisma.asset.findMany({ orderBy: { riskScore: "desc" } }),
    prisma.maintenanceLog.findMany({ where: { visibility: roleScopeByDemo[role] }, orderBy: { performedAt: "desc" } }),
    prisma.supplierOffer.findMany({ orderBy: { unitPriceUsd: "asc" } })
  ]);

  const kpis = {
    totalAssets: assets.length,
    highRiskAssets: assets.filter((asset) => asset.riskScore >= 70).length,
    stockAlerts: assets.filter((asset) => asset.stock < asset.minStock).length,
    upcomingServices: assets.filter((asset) => asset.nextServiceDate <= new Date("2026-05-01")).length,
    avgLeadTime: Math.round(suppliers.reduce((sum, item) => sum + item.leadTimeDays, 0) / Math.max(suppliers.length, 1))
  };

  return { assets, maintenances, suppliers, kpis };
}

export async function getAssetDetail(assetId: string, role: DemoRole) {
  return prisma.asset.findUnique({
    where: { id: assetId },
    include: {
      changes: {
        where: { visibility: roleScopeByDemo[role] },
        orderBy: { createdAt: "desc" }
      },
      maintenances: {
        where: { visibility: roleScopeByDemo[role] },
        orderBy: { performedAt: "desc" }
      },
      suppliers: {
        orderBy: { unitPriceUsd: "asc" }
      }
    }
  });
}

export async function findAssetId(term: string) {
  if (!term) {
    return null;
  }

  return prisma.asset.findFirst({
    where: {
      id: {
        contains: term.toUpperCase()
      }
    },
    select: { id: true }
  });
}
