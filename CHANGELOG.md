# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

## [Unreleased]

### Added
- Autenticación completa con NextAuth v5 (registro, login, sesión y middleware).
- Validaciones de auth y órdenes con Zod.
- Utilidad de fortaleza de contraseña + tests.
- Página de historial de pedidos (`/orders`).
- Panel admin de usuarios (`/admin/users`) con activar/desactivar.
- Panel admin de pedidos (`/admin/orders`) con cambio de estado y filtros por estado/email/fecha.
- API de órdenes para usuario autenticado (`GET/POST /api/orders`).
- API admin para usuarios y pedidos (`/api/admin/**`).
- Tests de dominio para reglas de usuarios y transición de estados de órdenes.
- Configuración de ESLint, Prettier y Vitest.

### Changed
- Migración de `npm` a `pnpm` (incluye `pnpm-lock.yaml` y scripts de desarrollo actualizados).
- Prisma schema extendido con modelos de NextAuth, órdenes y campo `isActive` en usuario.
- Checkout conectado a creación real de órdenes y prevención de doble envío.
- Header actualizado con accesos a `Mis pedidos`, `Admin usuarios` y `Admin pedidos` según rol.
- Logs de Prisma ajustados para reducir ruido en desarrollo.

### Removed
- `package-lock.json` (reemplazado por lockfile de pnpm).
