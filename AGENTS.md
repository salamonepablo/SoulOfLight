# SoulOfLight — AGENTS Constitution

Estas pautas son el "system prompt" para cualquier asistente de IA que contribuya al proyecto SoulOfLight. Sigue todas las reglas de este documento antes de escribir código, proponer cambios o responder consultas técnicas.

## Filosofía del Developer
- Las respuestas y explicaciones siempre en **español**.
- Sé proactivo y didáctico: explica decisiones y alternativas.
- Sé crítico con la arquitectura: cuestiona cambios que violen SOLID o acoplen UI con dominio.
- Propón simplificaciones cuando detectes sobre-ingeniería innecesaria.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | Next.js (App Router) | 14.2.x |
| UI | React | 18.3.x |
| Lenguaje | TypeScript (strict) | 5.9.x |
| Estado Global | Zustand | 5.x |
| ORM | Prisma | 5.19.x |
| Base de Datos | PostgreSQL | 16 (Docker) |
| Iconos | React Icons, Lucide | - |

---

## Entorno de Desarrollo

- **OS**: Windows 11 (migración futura a macOS)
- **Terminal**: Windows Terminal + PowerShell 7
- **Package Manager**: pnpm (más eficiente que npm)
- **Editor**: VSCode / Cursor

---

## Comandos de Desarrollo

### Setup Inicial
```powershell
# Levantar PostgreSQL con Docker
docker compose up -d

# Instalar dependencias con pnpm
pnpm install

# Generar cliente Prisma
npx prisma generate

# Sincronizar esquema y sembrar datos
pnpm db:push
pnpm db:seed

# Iniciar servidor de desarrollo
pnpm dev
```

### Scripts Disponibles (package.json)
| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo (localhost:3000) |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm lint` | Verificar errores con ESLint |
| `pnpm lint:fix` | Corregir errores automáticamente |
| `pnpm format` | Formatear código con Prettier |
| `pnpm format:check` | Verificar formato sin modificar |
| `pnpm typecheck` | Verificar tipos TypeScript |
| `pnpm db:push` | Sincronizar schema Prisma a PostgreSQL |
| `pnpm db:seed` | Poblar base de datos con productos |
| `npx prisma studio` | GUI visual para explorar la BD |

### Tests
```powershell
pnpm test                    # Watch mode (desarrollo)
pnpm test:run                # Ejecutar todos una vez
pnpm test:run src/lib        # Solo tests en src/lib
pnpm test -- -t "calcular"   # Tests que matcheen nombre
pnpm test:coverage           # Con reporte de coverage
```

### Lint/Format
```powershell
pnpm lint                    # Verificar errores de código
pnpm lint:fix                # Corregir automáticamente
pnpm format                  # Formatear todo el código
pnpm format:check            # Solo verificar (CI/CD)
pnpm typecheck               # Verificar tipos sin compilar
```

---

## Estructura del Proyecto

```
src/
├── app/                    # App Router (rutas y páginas)
│   ├── api/                # API Routes (route.ts)
│   ├── cart/               # Página del carrito
│   ├── checkout/           # Página de checkout
│   ├── products/           # Página de productos
│   ├── globals.css         # Estilos CSS globales
│   ├── layout.tsx          # Layout raíz
│   └── page.tsx            # Página principal (catálogo)
├── components/             # Componentes React reutilizables
│   ├── products/           # Componentes de productos
│   ├── Header.tsx
│   └── Footer.tsx
├── hooks/                  # Custom hooks
├── lib/                    # Utilidades y configuración
│   ├── prisma.ts           # Cliente Prisma singleton
│   ├── price.ts            # Formateo de precios
│   └── fonts.ts            # Tipografías
├── store/                  # Estado global (Zustand)
│   └── cartStore.ts
└── types/                  # Interfaces TypeScript
    └── product.ts
```

---

## Convenciones de Código

### Imports
- Usa el alias `@/*` para imports desde `src/`:
```typescript
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { formatMoney } from "@/lib/price";
import { prisma } from "@/lib/prisma";
```
- Orden de imports: 1) React/Next, 2) Librerías externas, 3) Alias `@/`

### Naming
| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase con `use` | `useProducts.ts` |
| Utilidades | camelCase | `price.ts` |
| Tipos/Interfaces | PascalCase | `Product`, `CartItem` |
| Variables/Funciones | camelCase | `formatMoney()` |
| Constantes | UPPER_SNAKE_CASE | `DEFAULT_CURRENCY` |

### TypeScript
- Modo estricto habilitado (`strict: true`)
- **NUNCA** usar `any`; usa `unknown` + type guards si es necesario
- Preferir interfaces sobre types para objetos
- Exportar tipos desde `@/types/`

### Componentes React
- **Server Components por defecto**
- Marcar `"use client"` solo cuando sea necesario (interactividad, hooks de estado, APIs del navegador)
- Componentes funcionales, pequeños, responsabilidad única
- Props destructuradas con tipos explícitos

```typescript
// Server Component (por defecto)
export default async function ProductsPage() {
  const products = await prisma.product.findMany();
  return <ProductGrid products={products} />;
}

// Client Component (solo cuando necesario)
"use client";
export function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  return <button onClick={() => addToCart(product)}>Agregar</button>;
}
```

### Estilos
- **No usa Tailwind CSS**; usa CSS vanilla en `globals.css`
- Clases utilitarias personalizadas (sintaxis similar a Tailwind)
- Evitar inline styles excepto para valores dinámicos

### Manejo de Errores
- Usar try/catch en funciones async
- Logging descriptivo en español
- Propagar errores con mensajes claros
- En API routes: retornar Response con status code apropiado

---

## Base de Datos (Prisma)

### Conexión
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/souloflight?schema=public"
```

### Modelos Principales
- `Product`: Productos (sahumerios)
- `Service`: Servicios (tarot, numerología)
- `User`, `Order`, `OrderItem`: Pendientes de implementar

### Cliente Prisma (Singleton)
```typescript
// src/lib/prisma.ts - ya configurado
import { prisma } from "@/lib/prisma";
```

---

## Estado Global (Zustand)

```typescript
import { useCartStore } from "@/store/cartStore";

// En componentes Client
const { items, addToCart, removeFromCart, clearCart } = useCartStore();
```
- Persistencia automática en localStorage
- Key: `souloflight-cart`

---

## Filosofía de Arquitectura

- **Es un MVP**: aplica principios SOLID pero evita la sobre-ingeniería
- Arquitectura **Feature/Vertical Slice** con separación Domain/Data/UI
- La lógica de negocio pertenece a `src/modules/<feature>/domain`, NO en componentes UI
- Adaptar Clean Architecture simplificada al App Router de Next.js 14

---

## Infraestructura (Costo Cero)

| Servicio | Proveedor Recomendado |
|----------|----------------------|
| Frontend | Vercel |
| Base de Datos | Neon Tech / Supabase (solo DB) |
| Imágenes | Cloudinary |

---

## Workflow de Desarrollo

### Regla de Oro
> **"Primero arreglar, luego construir"**

Atiende bugs abiertos antes de nuevas features.

### Commits
Usar **Conventional Commits**:
```
feat: agregar filtro por categoría
fix: corregir cálculo de totales en carrito
refactor: extraer lógica de precios a servicio
docs: actualizar AGENTS.md
chore: actualizar dependencias
```

### Prioridades
1. Corregir bugs existentes
2. Añadir tests para código existente
3. Refactorizar deuda técnica
4. Implementar nuevas features

---

## Variables de Entorno

```env
# Requeridas
DATABASE_URL="postgresql://..."

# Opcionales
NEXT_PUBLIC_LOCALE=es-AR
NEXT_PUBLIC_CURRENCY=ARS
```

---

## Seguridad (CRÍTICO)

Este proyecto manejará datos de clientes y pagos. La seguridad es **prioridad máxima**.

### Referencia: OWASP Top 10
Seguimos las recomendaciones de [OWASP Top 10](https://owasp.org/www-project-top-ten/):

| # | Riesgo | Mitigación en SoulOfLight |
|---|--------|---------------------------|
| A01 | Broken Access Control | Middleware de auth, validar permisos en servidor |
| A02 | Cryptographic Failures | bcrypt para passwords, HTTPS obligatorio |
| A03 | Injection | Prisma (ORM parametrizado), Zod para validación |
| A04 | Insecure Design | Validación servidor-side, principio de mínimo privilegio |
| A05 | Security Misconfiguration | Headers seguros, no exponer stack traces |
| A06 | Vulnerable Components | `npm audit`, mantener dependencias actualizadas |
| A07 | Auth Failures | NextAuth.js, rate limiting, sesiones seguras |
| A08 | Data Integrity Failures | Verificar webhooks con signatures |
| A09 | Logging Failures | Logs de eventos de seguridad (sin datos sensibles) |
| A10 | SSRF | No fetch a URLs de usuario sin validación |

### Principios Obligatorios
1. **NUNCA almacenar contraseñas en texto plano** - usar bcrypt/argon2
2. **NUNCA almacenar datos de tarjetas** - delegar a MercadoPago/Stripe
3. **NUNCA exponer secrets en el frontend** - solo `NEXT_PUBLIC_*` son públicas
4. **NUNCA confiar en input del usuario** - validar con Zod en servidor
5. **SIEMPRE usar HTTPS** en producción
6. **SIEMPRE sanitizar datos** antes de renderizar (prevenir XSS)

### Autenticación (por implementar)
- Usar **NextAuth.js v5** (Auth.js) con estrategia Credentials + OAuth
- Sesiones con JWT firmado (no cookies de sesión en DB para MVP)
- Passwords hasheados con **bcrypt** (mínimo 12 rounds)

### Validación de Datos
- **Zod** para validación de schemas en API routes
- Validar en servidor SIEMPRE, cliente es opcional (UX)
```typescript
// Ejemplo: src/lib/validations/user.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  name: z.string().min(2).optional(),
});
```

### Variables de Entorno Sensibles
```env
# NUNCA commitear estos valores reales
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="генерировать-con-openssl"
NEXTAUTH_URL="http://localhost:3000"
MERCADOPAGO_ACCESS_TOKEN="..."
```

### Headers de Seguridad
Configurar en `next.config.js`:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options

---

## TDD - Test Driven Development

### Metodología: Red, Green, Refactor

```
1. RED    → Escribir test que falla (define el comportamiento esperado)
2. GREEN  → Escribir código mínimo para que pase
3. REFACTOR → Mejorar el código manteniendo tests verdes
```

### Reglas TDD para este Proyecto
- **Todo código nuevo** debe tener tests ANTES de implementar
- **Bug fixes**: primero escribir test que reproduce el bug, luego arreglar
- **Refactors**: asegurar tests existentes antes de modificar
- Coverage mínimo objetivo: **80%** en lógica de negocio

### Estructura de Tests
```
src/
├── __tests__/              # Tests de integración
│   └── api/
│       └── products.test.ts
├── modules/
│   └── cart/
│       ├── domain/
│       │   ├── cart.service.ts
│       │   └── cart.service.test.ts  # Test unitario junto al código
```

### Comandos de Test (cuando Vitest esté configurado)
```powershell
npm run test                    # Ejecutar todos
npm run test -- --watch         # Watch mode
npm run test -- cart.service    # Un archivo específico
npm run test -- -t "calcular"   # Tests que matcheen nombre
npm run test -- --coverage      # Con reporte de coverage
```

### Ejemplo de Test TDD
```typescript
// 1. RED - Escribir el test primero
describe("CartService", () => {
  it("debe calcular el total con descuento", () => {
    const cart = new CartService();
    cart.addItem({ id: 1, price: 100, quantity: 2 });
    cart.applyDiscount(10); // 10%
    
    expect(cart.getTotal()).toBe(180); // 200 - 10%
  });
});

// 2. GREEN - Implementar lo mínimo
// 3. REFACTOR - Mejorar sin romper el test
```

---

## Roadmap de Desarrollo

### Fase 0: Fundamentos (Actual)
- [x] Catálogo de productos funcional
- [x] Carrito con persistencia local
- [x] Checkout básico (sin pagos)
- [x] **0.1** Configurar ESLint + Prettier
- [x] **0.2** Configurar Vitest + Testing Library
- [x] **0.3** Agregar tests a código existente (cartStore, price utils)

### Fase 1: Seguridad y Autenticación
- [x] **1.1** Instalar y configurar NextAuth.js v5
- [x] **1.2** Migrar modelo User (password hash con bcrypt)
- [x] **1.3** Implementar registro con validación Zod
- [x] **1.4** Implementar login/logout
- [x] **1.5** Proteger rutas (middleware)
- [x] **1.6** Tests de autenticación

### Fase 2: Órdenes y Persistencia
- [ ] **2.1** API de órdenes (CRUD)
- [ ] **2.2** Flujo: carrito → orden → confirmación
- [ ] **2.3** Historial de órdenes del usuario
- [ ] **2.4** Emails transaccionales (confirmación)
- [ ] **2.5** Tests de órdenes

### Fase 3: Pagos
- [ ] **3.1** Integrar MercadoPago SDK
- [ ] **3.2** Checkout Pro (redirect)
- [ ] **3.3** Webhooks para actualizar estado de orden
- [ ] **3.4** Manejo de errores y reintentos
- [ ] **3.5** Tests con mocks de MercadoPago

### Fase 4: Panel Administrativo
- [ ] **4.1** Ruta protegida `/admin`
- [ ] **4.2** CRUD de productos
- [ ] **4.3** Gestión de órdenes
- [ ] **4.4** Dashboard básico (ventas, stock)

### Fase 5: Producción
- [ ] **5.1** Deploy en Vercel
- [ ] **5.2** Migrar BD a Neon/Supabase
- [ ] **5.3** Configurar dominio y SSL
- [ ] **5.4** Monitoreo y logs (Vercel Analytics)
- [ ] **5.5** Backup automático de BD
