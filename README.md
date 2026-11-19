# Terra Creaciones · Tejiendo sueños

Tienda web de bolsos, carteras y otros tejidos a mano, con catálogo, cuentas de clientes y panel de administración.

## Arquitectura

```
terra-creaciones/
├── backend/    API REST · Java 25 + Spring Boot 3 + PostgreSQL
├── frontend/   SPA · React 18 + TypeScript + Vite
└── docker-compose.yml
```

| Capa | Tecnologías | Por qué |
|------|-------------|---------|
| Backend | Java 25, Spring Boot 3.5, Spring Security + JWT, Spring Data JPA, Flyway, Bean Validation | Es el stack de backend más pedido en el mercado laboral; el diseño en capas es el estándar de la industria. |
| Base de datos | PostgreSQL 16 | Base relacional estándar; gratis en Neon, Supabase o Render. |
| Frontend | React 18, TypeScript, Vite, React Router, TanStack Query | React + TypeScript es lo más solicitado en frontend; Vite da builds rápidos. |
| Infra | Docker, docker compose, nginx | Mismo entorno en tu máquina y en producción. |

### Backend (`backend/src/main/java/com/terracreaciones`)

```
config/      seguridad (SecurityConfig), CORS, archivos subidos, admin inicial
security/    emisión y validación de JWT
domain/      entidades JPA (Product, Category, Color, AppUser, SiteSettings)
repository/  acceso a datos (Spring Data)
service/     lógica de negocio (CatalogService, AuthService)
web/         controladores REST y manejo de errores
dto/         contratos de la API (records con validación)
```

Migraciones en `src/main/resources/db/migration` (Flyway): `V1` crea el esquema y `V2` carga los datos de ejemplo.

### Frontend (`frontend/src`)

```
api/         cliente HTTP y hooks de datos (TanStack Query)
context/     sesión del usuario (AuthContext)
components/  Layout, ProductCard, ProductVisual, Watermarks, BackButton...
pages/       Home, Category, Product, Login y admin/ (panel de administración)
```

## Cómo correrlo

### Opción 1: todo con Docker

```bash
cp .env.example .env     # editá ADMIN_EMAIL, ADMIN_PASSWORD y JWT_SECRET
docker compose up --build
```

Tienda en http://localhost:3000 · API en http://localhost:8080.

### Opción 2: desarrollo

```bash
# 1) Base de datos
docker compose up db -d

# 2) Backend (Java 25 y Maven)
cd backend
ADMIN_EMAIL=admin@terracreaciones.com ADMIN_PASSWORD=cambiame-ya-123 mvn spring-boot:run

# 3) Frontend (Node 20)
cd frontend
npm install
npm run dev              # http://localhost:5173
```

La cuenta de administrador se crea sola al primer arranque con `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Ingresá desde "👤 Ingresar" y aparece el botón "⚙️ Admin".

## API

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/auth/register`, `/api/auth/login` | público |
| GET | `/api/auth/me` | sesión iniciada |
| GET | `/api/categories`, `/api/colors`, `/api/products`, `/api/products/{slug}`, `/api/settings` | público |
| POST/PUT/DELETE | `/api/admin/categories`, `/api/admin/colors`, `/api/admin/products` | ADMIN |
| PUT | `/api/admin/settings` | ADMIN |
| POST | `/api/admin/uploads` (foto JPG/PNG/WebP, máx. 5 MB) | ADMIN |

## Seguridad

- Contraseñas con BCrypt; sesión con JWT sin estado (24 h).
- Los clientes se registran solo con rol `USER`: el rol `ADMIN` únicamente se crea desde las variables de entorno.
- Las rutas `/api/admin/**` exigen rol `ADMIN` en el servidor, no solo en la interfaz.
- En producción definí un `JWT_SECRET` propio y largo, y `CORS_ORIGINS` con el dominio real del frontend.

## Publicarlo gratis (opciones habituales)

- **Frontend:** Cloudflare Pages, Netlify o Vercel (build `npm run build`, carpeta `dist`, variable `VITE_API_URL` con la URL del backend).
- **Backend:** Render, Railway o Fly.io usando `backend/Dockerfile`.
- **Base de datos:** Neon o Supabase (PostgreSQL): copiá la cadena de conexión en `DB_URL`, `DB_USER` y `DB_PASSWORD`.

Los planes gratuitos cambian con el tiempo: revisá las condiciones vigentes antes de elegir.

Las fotos se guardan en disco (`UPLOADS_DIR`). En servicios con disco efímero conviene pasar a un almacenamiento externo (Cloudinary, S3 o Supabase Storage).

## Próximos pasos sugeridos

- Tests de integración con Testcontainers.
- Carrito y pedidos.
- Almacenamiento de imágenes en la nube.
