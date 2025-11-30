# Alma de Luz (antes: SoulOfLight)

> E-commerce / catálogo holístico minimal (MVP) para sahumerios, servicios y productos espirituales.

Este repositorio implementa un MVP en **Next.js 14 + TypeScript + Prisma + PostgreSQL** orientado a claridad y capacidad de crecimiento rápido. Se prioriza arquitectura limpia y decisiones explicadas sobre exhaustividad funcional.

**Estado actual (MVP):**
- Listado de productos (`/products`) desde API `/api/products`.
- Carrito persistido (Zustand + localStorage).
- Checkout básico (sin pagos ni creación real de órdenes).
- Semilla automática leyendo imágenes de `public/images` con reglas de negocio simples.
- Branding: Header con “Alma de Luz” (tipografía Cormorant) y Footer compacto.
- Fallback de imagen uniforme (`almadeluz.jpg`) si un producto no tiene imagen válida.
- Formateo multi-moneda configurable vía variables de entorno.
- Modelos enriquecidos con tamaños de pack (`unitsPerPack`, `packs`).

## Stack
- Frontend: Next.js 14 (App Router) + React + TypeScript
- Estado: Zustand (persistencia local)
- Backend: API Routes de Next.js
- ORM/DB: Prisma 5 + PostgreSQL (Docker opcional)

## Estructura breve
- `src/app` páginas (App Router)
- `src/app/api/products/route.ts` endpoint productos
- `src/components/Header.tsx` branding + navegación + badge carrito
- `src/components/Footer.tsx` barra compacta (marca + Instagram + email)
- `src/components/products/*` componentes de catálogo
- `src/lib/price.ts` utilidades de formateo multi-moneda (`formatMoney`)
- `src/lib/fonts.ts` tipografías centralizadas (Cormorant actual)
- `src/store/cartStore.ts` estado global del carrito
- `prisma/schema.prisma` modelos (incluye `unitsPerPack`, `packs`)
- `prisma/seed.js` seed dinámico por nombres de archivo

## Funcionalidades implementadas
- Catálogo: `GET /api/products` + páginas `/` (destacados) y `/products`.
- Carrito: agregar, remover, vaciar; badge con contador global.
- Checkout: formulario mínimo (validación básica en cliente).
- Semilla inteligente: infiere nombre, precio y empaquetado desde archivo.
- Fallback de imagen: si falla carga o falta imagen se usa `/images/almadeluz.jpg`.
- Precios multi-moneda/locale (Intl) con `formatMoney`.
- Packs y unidades por pack visibles en datos (no en UI todavía).

## Qué no está (todavía)
- Autenticación UI (modelo `User` sin lógica de registro/login).
- Órdenes/pedidos persistentes (modelos `Order` y `OrderItem` sin flujo).
- Procesador de pagos / integración PSP.
- Panel administrativo / gestión avanzada de stock.
- Tests automatizados (unitarios/E2E).
- Selección dinámica de moneda/locale en UI (se prepara base para futuro).

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

Sincroniza el esquema y ejecuta seeds (crea productos desde las imágenes):

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
**Editor Prisma vs versión instalada:** la extensión de VS Code puede mostrar advertencia sobre `datasource url` (formato futuro Prisma 7). El CLI (Prisma 5.x) valida correctamente — se puede ignorar.

**Semilla:** si no existen imágenes en `public/images` se mostrará un warning y quedará catálogo vacío.

**Sin tests:** aún no se incluyeron pruebas automáticas.

No hay errores JSX conocidos pendientes en `cart` tras último refactor.

## Semilla de productos: reglas
El seed lee todos los archivos de imagen (`.jpg|.jpeg|.png|.webp`) en `public/images` y genera productos:

- Se excluye siempre la imagen `almadeluz.*` (fallback).
- Nombre: partes del filename separadas por `-`, capitalizadas; si hay 3 partes (combo) se describe como combo.
- Regla tibetano: si el nombre base termina en `-tibetano`:
	- `price = 2000`
	- `unitsPerPack = 3`
	- `packs = 1`
- Combo (3 segmentos, no tibetano):
	- `price = 10000`
	- `unitsPerPack = 6`
	- `packs = 3` (total 18 sahumerios)
- Estándar (otro caso):
	- `price = 3500`
	- `unitsPerPack = 6`
	- `packs = 1`

Puedes re-sembrar tras cambiar imágenes:
```powershell
npm run db:push
npm run db:seed
```

## Formato de precios multi-moneda
Archivo: `src/lib/price.ts`

Uso principal:
```ts
import { formatMoney } from '@/lib/price';
formatMoney(1234.5);              // según NEXT_PUBLIC_LOCALE/CURRENCY
formatMoney(1234.5, { currency:'USD', locale:'en-US' });
```

Variables de entorno para cambiar moneda sin tocar código:
```
NEXT_PUBLIC_LOCALE=es-AR
NEXT_PUBLIC_CURRENCY=ARS
```
Ejemplos futuros:
```
NEXT_PUBLIC_LOCALE=en-US
NEXT_PUBLIC_CURRENCY=USD
```

## Branding y UI
- Header: título "Alma de Luz" (Cormorant), logo circular, subtítulo reducido para jerarquía.
- Footer: barra tipo píldora con marca + dos cuentas Instagram + email.
- Tipografías centralizadas en `src/lib/fonts.ts` para cambio rápido.
- Page headings suavizados para no competir con la marca.

## Imagen fallback
Si un producto carece de imagen o hay error de carga, se reemplaza por `/images/almadeluz.jpg`.

## Extender a futuro
- Mostrar packs/unidades en UI (badge "3×6 = 18").
- Selector de moneda/idioma en el Header.
- Autenticación + órdenes reales.
- Modo oscuro y accesibilidad reforzada.

## Scripts útiles (resumen)

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
- Selector de moneda/locale en tiempo real.
- Integración de pagos (Stripe / MercadoPago).
- Flujos de órdenes y panel admin.
- Tests (unitarios y E2E) + auditoría de accesibilidad.
- Internacionalización completa (i18n de textos).

---

> Contacto: abierto a feedback y sugerencias.