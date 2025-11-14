# SoulOfLight – E-commerce de Productos Para tu Alma de Luz y Servicios Holísticos

SoulOfLight es una aplicación web de comercio electrónico desarrollada con **Next.js 14 (App Router)**, **TypeScript**, **Prisma ORM** y **PostgreSQL**.  
El proyecto combina venta de productos (sahumerios, velas, etc.) con la contratación de servicios holísticos como tarot, y numerología.

Este proyecto forma parte de mi portfolio profesional como desarrollador Full Stack, orientado a obtener oportunidades laborales en España.

---

## 🚀 Tecnologías principales

| Área | Tecnología |
|------|------------|
| **Frontend** | React + Next.js 14 (App Router) |
| **Lenguaje** | TypeScript |
| **Backend** | API Routes de Next.js |
| **ORM** | Prisma 5 |
| **Base de datos** | PostgreSQL (Docker) |
| **Herramientas** | Docker Compose, GitHub |
| **Estilos** | CSS, componentes básicos (se ampliará luego) |

---

## 🧱 Arquitectura general

El proyecto está organizado en una arquitectura limpia y moderna:


- El **frontend** consume la API interna de Next.js.  
- El **backend** gestiona productos y servicios con Prisma.  
- La **base de datos** corre en un contenedor PostgreSQL, garantizando entorno controlado y fácil despliegue.  

---

## 📦 Funcionalidades actuales

### ✔️ Productos
- API `GET /api/products` que devuelve productos en formato JSON.  
- Visualización de productos en `/products`.  
- Modelo Prisma: `Product{id, name, description, price, stock, imageUrl}`.  
- Seed automático con 3 productos iniciales.

### ✔️ Infraestructura
- Docker Compose para PostgreSQL.
- Prisma Client generado automáticamente.
- Ignorados `.env` y `node_modules` para cumplir buenas prácticas.

---

## 🔧 Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/salamonepablo/SoulOfLight.git
cd SoulOfLight