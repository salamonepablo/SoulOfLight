# SoulOfLight

>E-commerce minimal (MVP) para productos y servicios holísticos.

Este repositorio muestra un MVP en Next.js con TypeScript, Prisma y PostgreSQL. Está pensado para evaluación técnica: prioriza código claro y una base correcta antes que funcionalidades completas.: a continuación detallo qué está hecho, qué falta y cómo correrlo.

**Estado actual (MVP):**
- Listado de productos con datos desde base (API `/api/products`).
- Carrito con estado en `localStorage` (Zustand).
- Checkout básico de ejemplo (sin backend de pagos ni órdenes).
- Semillas de productos y modelos base en Prisma.

## Stack
- Frontend: Next.js 14 (App Router) + React + TypeScript
- Estado: Zustand (persistencia local)
- Backend: API Routes de Next.js
- ORM/DB: Prisma 5 + PostgreSQL (Docker opcional)

## Estructura breve
- `src/app` páginas (App Router)
- `src/app/api/products/route.ts` endpoint de productos
- `src/components/Header.tsx` navegación + contador del carrito
- `src/store/cartStore.ts` estado del carrito (Zustand persistido)
- `prisma/schema.prisma` modelos y datasource
- `prisma/seed.(js|ts)` carga de datos de ejemplo

## Funcionalidades implementadas
- Productos: `GET /api/products` devuelve el catálogo desde Prisma.
- UI de productos: `/products` lista items y permite agregarlos al carrito.
- Carrito: `/cart` muestra productos, totales y permite quitar/limpiar.
- Checkout: `/checkout` formulario simple; simula compra en cliente.

## Qué no está (todavía)
- Autenticación/usuarios en UI (existe modelo `User`, sin flujo implementado).
- Órdenes/pedidos reales (existen modelos `Order`/`OrderItem`, sin lógica).
- Pagos/checkout real (el checkout actual es demostrativo).
- Panel de administración y stock en tiempo real.

## Puesta en marcha (local)
Requisitos: Node 18+, Docker (opcional), pnpm/npm/yarn.

### 1) Variables de entorno
Crear `.env` en la raíz con la conexión a Postgres. Si usas el `docker-compose.yml` incluido (expone Postgres en `5433`):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/souloflight?schema=public"
```

### 2) Base de datos
Opción A — Docker (recomendado para probar rápido):

```powershell
docker compose up -d
```

Opción B — Postgres local: apunta `DATABASE_URL` a tu instancia.

Sincroniza el esquema y ejecuta seeds:

```powershell
npm install
npm run db:push
npm run db:seed
```

### 3) Ejecutar la app

```powershell
npm run dev
```

La app debería abrir en `http://localhost:3000`.

Si aparece un error de compilación, revisa la sección “Known issues”.

## Known issues (a propósito de la transparencia)
- `src/app/cart/page.tsx`: hay JSX a refactorizar (un enlace a `/checkout` quedó fuera del JSX principal). Esto puede causar error en `npm run dev` hasta corregirlo.
- Imágenes: asumen archivos bajo `public/images`. Si faltan, Next Image puede advertir.
- Sin tests: el repo aún no incluye pruebas automáticas.

## Scripts útiles
- `npm run dev`: levantar el servidor de desarrollo.
- `npm run build` / `npm start`: build y arranque en producción.
- `npm run db:push`: sincroniza el esquema Prisma a la base.
- `npm run db:seed`: carga datos de ejemplo.

## Por qué este enfoque
Preferí entregar un MVP navegable y legible, con modelos listos para crecer, antes que funcionalidades simuladas. Así puede evaluarse:
- Estructura del proyecto en App Router.
- Uso de Prisma y separación de capas simples.
- Estado global con persistencia sin sobreingeniería.

## Próximos pasos
- Arreglar JSX de `/cart` y pulir UI básica.
- Implementar creación de órdenes y checkout real (Stripe u otro PSP).
- Autenticación (NextAuth) y perfiles.
- Administración de productos/stock.
- Tests E2E (Playwright) y unitarios.

---

> Contacto: abierto a feedback y sugerencias.