# MineAsset Tracker

Aplicación web (portfolio-ready) para gestión de activos críticos en minería.

## Objetivo

Centralizar inventario técnico, mantenimiento, trazabilidad de cambios y comparación de proveedores, con visibilidad diferenciada por roles demo.

## Plan por fases

1. **Fase 1 (implementada en este repo)**
   - Base técnica con Next.js + TypeScript + Tailwind + Prisma + SQLite.
   - Datos demo locales con activos críticos.
   - Dashboard con KPIs, buscador por ID, semáforo de riesgo.
   - Ficha de activo con historial de cambios/mantenimiento y reposición.
   - Roles demo sin autenticación real.
2. **Fase 2**
   - Formularios CRUD de activos, mantenimientos y cotizaciones.
   - Filtros avanzados, paginación y exportes CSV/PDF.
3. **Fase 3**
   - Notificaciones de riesgo, reglas de negocio configurables.
   - Conexión a fuentes externas (ERP/CMMS) y auditoría extendida.
4. **Fase 4**
   - Autenticación real, permisos granulares y trazabilidad completa.
   - Monitoreo, observabilidad y despliegue productivo.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- SQLite (v1)

## Estructura inicial

```bash
frontend/
├── app/
│   ├── assets/[id]/page.tsx
│   ├── providers/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── KpiCard.tsx
│   ├── RiskBadge.tsx
│   └── RoleTabs.tsx
├── lib/
│   ├── data.ts
│   ├── prisma.ts
│   ├── risk.ts
│   └── roles.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── package.json
```

## Datos demo incluidos

Activos mínimos (incluidos en seed):
- neumático de camión minero
- bomba hidráulica
- motor eléctrico industrial
- correa transportadora
- filtro industrial
- componente de freno

## Ejecutar el proyecto

```bash
cd frontend
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Abrir `http://localhost:3000`.

## Roles demo (sin autenticación)

- **Ejecutivo**: foco en criticidad/costo.
- **Mantenimiento**: foco en historial técnico.
- **Abastecimiento**: foco en proveedores y lead time.
- **Operaciones**: foco en disponibilidad diaria.

La selección se hace desde tabs en el dashboard.
