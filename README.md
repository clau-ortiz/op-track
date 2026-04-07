# OpTrack – Sistema de Control Operacional

Aplicación web profesional para análisis operacional: carga CSV, validación estricta, cálculo de KPIs, detección de alertas, resumen ejecutivo automático y recomendaciones accionables.

## Arquitectura

- **Frontend**: React + TypeScript + Tailwind + Recharts.
- **Backend**: FastAPI + pandas.
- **Entrada inicial**: CSV con columnas exactas:
  - `fecha`
  - `turno`
  - `horas_operativas`
  - `produccion`
  - `meta_produccion`
  - `costo_total`
  - `detenciones`
  - `tiempo_detencion`
  - `incidentes`

## Estructura

```bash
op-track/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── schemas.py
│   │   └── services.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── sample_operacional.csv
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── styles.css
│   │   └── types.ts
│   ├── package.json
│   └── ...
├── data/
│   └── sample_operacional.csv
└── README.md
```

## Ejecución local

### 1) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Endpoints principales:
- `GET /health`
- `GET /template` (descarga plantilla CSV)
- `POST /analyze` (subida y análisis CSV)

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Por defecto usa `http://localhost:8000` para API.
Opcionalmente definir `VITE_API_URL`.

## Validaciones implementadas

- Archivo con extensión `.csv`.
- CSV no vacío.
- Columnas requeridas completas.
- Tipos numéricos correctos en campos numéricos.
- `fecha` interpretable.
- Sin nulos en columnas críticas.
- `horas_operativas > 0`.
- `produccion` y `meta_produccion >= 0`.
- `tiempo_detencion >= 0`.
- `incidentes` y `detenciones >= 0`.

## KPIs y analítica

- Eficiencia operacional (`produccion / horas_operativas`).
- Cumplimiento de meta (`produccion / meta_produccion`).
- Costo unitario (`costo_total / produccion`).
- Tasa de detención (`tiempo_detencion / horas_operativas`).
- Índice de incidentes.
- Producción promedio por turno.
- Variación diaria de producción.
- Tendencia de eficiencia.
- Desviación estándar de producción.
- Peor turno.
- Días críticos de bajo rendimiento.

## Alertas de negocio

- Eficiencia operacional promedio < 0.80.
- Cumplimiento de meta promedio < 0.90.
- Registros con detenciones sobre promedio del período.
- Eficiencia turno noche menor que turno día (si existen ambos turnos).
- Incidentes > 0.
- Tasa de detención sobre promedio.

## Reporte

La interfaz entrega:
- Tarjetas KPI.
- Gráficos (producción diaria, eficiencia por turno, costos, cumplimiento diario).
- Alertas y recomendaciones.
- Resumen ejecutivo automático y sección preparada para exportación PDF futura.

## Archivo de prueba

Use `data/sample_operacional.csv` o descargue la plantilla en `GET /template`.

## Despliegue sugerido

- **Backend**: Render, Fly.io, Railway o AWS ECS/Fargate.
- **Frontend**: Vercel, Netlify o Cloudflare Pages.
- Configurar CORS de backend para dominio productivo.
- Añadir persistencia (S3/Blob + base de datos) en siguientes versiones.
