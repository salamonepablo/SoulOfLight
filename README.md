# SoulOfLight (Alma de Luz)

E-commerce MVP para productos holísticos (sahumerios) con autenticación, carrito persistente, checkout y gestión administrativa inicial.

## Estado actual

- Catálogo de productos (`/` y `/products`) consumiendo `/api/products`.
- Carrito con Zustand + persistencia en `localStorage`.
- Registro/Login con NextAuth Credentials y validación Zod.
- Protección de rutas por sesión y rol (`CUSTOMER` / `ADMIN`).
- Checkout conectado a creación real de órdenes (`POST /api/orders`).
- Historial de pedidos del usuario (`/orders`).
- Panel admin de usuarios (`/admin/users`) con baja lógica (`isActive`).
- Panel admin de pedidos (`/admin/orders`) con cambio de estado y filtros.
- Tests unitarios de validaciones y dominio (auth, password strength, órdenes).

## Stack

- Next.js 14 (App Router)
- React 18 + TypeScript (strict)
- Prisma 5 + PostgreSQL
- NextAuth.js v5 (beta)
- Zustand
- Zod
- Vitest + Testing Library

## Setup local

### 1) Variables de entorno

Crear `.env` en la raíz:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/souloflight?schema=public"
AUTH_SECRET="tu-secret-local"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_LOCALE="es-AR"
NEXT_PUBLIC_CURRENCY="ARS"
```

### 2) Base de datos

Si usás Docker:

```powershell
docker compose up -d
```

Instalar dependencias y sincronizar esquema:

```powershell
pnpm install
pnpm db:push
pnpm db:seed
```

### 3) Ejecutar app

```powershell
pnpm dev
```

Abrir: `http://localhost:3000`

## Scripts

- `pnpm dev`: servidor de desarrollo
- `pnpm build`: build de producción
- `pnpm start`: servidor de producción
- `pnpm lint`: lint sobre `src/`
- `pnpm lint:fix`: corrige lint automáticamente
- `pnpm format`: formatea con Prettier
- `pnpm format:check`: valida formato
- `pnpm typecheck`: chequeo de tipos TypeScript
- `pnpm test`: tests en watch
- `pnpm test:run`: tests una sola ejecución
- `pnpm test:coverage`: cobertura
- `pnpm db:push`: sincroniza Prisma schema
- `pnpm db:seed`: carga datos de ejemplo

## Módulos principales

- Auth y sesiones: `src/lib/auth.ts`, `src/middleware.ts`
- API auth: `src/app/api/auth/**`
- API órdenes: `src/app/api/orders/route.ts`
- API admin: `src/app/api/admin/**`
- Dominio órdenes: `src/modules/orders/domain/**`
- Dominio usuarios: `src/modules/users/domain/**`

## Notas de seguridad

- Contraseñas hasheadas con `bcryptjs` (rounds 12).
- Validación server-side con Zod.
- Mensajes de error genéricos en auth para minimizar enumeración.
- Rutas admin protegidas por rol en middleware y API.
- Baja de usuario por desactivación (`isActive=false`), no borrado físico.

## Próximos pasos sugeridos

- Emails transaccionales en creación de orden.
- Panel admin CRUD de productos.
- Integración de pagos (MercadoPago/Stripe).
- Más tests de integración API (auth + órdenes + admin).
