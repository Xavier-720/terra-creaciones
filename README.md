# Terra Creaciones · Tejiendo sueños

Tienda web para el catálogo y la venta de productos tejidos a mano (bolsos, carteras, amigurumis y accesorios). Incluye consultas por WhatsApp, panel de administración con CRUD completo y autenticación con Supabase (Auth, Database y Storage).

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=111)
![Java](https://img.shields.io/badge/Java-25-orange?logo=openjdk&logoColor=white)

## Contenido

- [Características](#características)
- [Stack](#stack)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Gestión de administradores](#gestión-de-administradores)
- [Backend opcional con Java](#backend-opcional-con-java)
- [Despliegue](#despliegue)

## Características

- **Catálogo interactivo**: navegación por categorías con íconos, filtros y variantes de color con previsualización.
- **Consultas por WhatsApp en un clic**: mensaje preformateado según el producto (`wa.me`, formato internacional +54 9 ...).
- **Panel de administración**:
  - Productos: crear, editar, destacar en la portada y eliminar con borrado en cascada.
  - Categorías: alta y edición con selector visual de emojis.
  - Paleta de colores: selector HEX para asociar colores a los tejidos.
  - Configuración del local: WhatsApp, dirección y horarios.
- **Autenticación nativa y RLS**: registro/login con Supabase Auth y políticas de fila; lectura pública para visitantes y escritura solo para el rol `ADMIN`.
- **Diseño responsivo y artesanal**: Cormorant Garamond + Nunito, modo claro/oscuro y marcas de agua ilustradas.

## Stack

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 18 · TypeScript · Vite · React Router 6 · TanStack Query |
| Backend y datos | Supabase (PostgreSQL 16, PostgREST, Auth, Storage) |
| Backend opcional | Java 25 · Spring Boot 3.5 · Spring Security · JWT · Flyway · Maven · Docker |
| Estilos | CSS3 nativo con variables, sin frameworks de estilos |

## Estructura del repositorio

```text
terra-creaciones/
├── frontend/
│   ├── src/
│   │   ├── api/          # clientes de Supabase y hooks de React Query
│   │   ├── components/   # Layout, Cards, Icons, etc.
│   │   ├── context/      # AuthContext
│   │   ├── pages/        # Inicio, Categoría, Detalle, Login
│   │   │   └── admin/    # Productos, Categorías, Colores, Local
│   │   └── types.ts
│   ├── .env.example
│   └── package.json
├── backend/              # API REST opcional en Spring Boot
├── supabase-schema.sql   # tablas, RLS, Storage y datos semilla
└── docker-compose.yml
```

## Requisitos

- Node.js 18 o superior.
- Un proyecto gratuito en [Supabase](https://supabase.com).
- Opcional: Java 25 y Docker para el backend alternativo.

## Puesta en marcha

### 1. Preparar Supabase

En el SQL Editor de tu proyecto, ejecutá el contenido de [`supabase-schema.sql`](./supabase-schema.sql). Eso crea:

- Tablas: `categories`, `colors`, `products`, `product_features`, `product_colors`, `site_settings`.
- Políticas RLS de lectura pública y escritura para administradores.
- El bucket de imágenes `product-images` y los datos de ejemplo.

### 2. Variables de entorno

En `frontend/`, creá `.env` a partir de `.env.example`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon
```

### 3. Iniciar la tienda

```bash
cd frontend
npm install
npm run dev
```

Abrí <http://localhost:5173>.

## Gestión de administradores

1. Registrate desde **Ingresar → Soy nuevo** en la web.
2. En el SQL Editor de Supabase, asignate el rol:

   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = raw_app_meta_data || '{"role": "ADMIN"}'::jsonb
   WHERE email = 'tu_email@ejemplo.com';
   ```

3. Cerrá sesión y volvé a entrar: aparece el botón **Admin** en el menú.

## Backend opcional con Java

La carpeta `backend/` contiene una API REST alternativa con Spring Boot y JWT. Está pensada para quien quiera evitar Supabase como backend; el frontend usa Supabase por defecto y no la necesita para funcionar.

## Despliegue

El frontend es estático. En Netlify, Vercel o Cloudflare Pages configurá:

| Campo | Valor |
| --- | --- |
| Root directory | `frontend` |
| Build command | `npm run build` |
| Output directory | `dist` |

Agregá las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el panel del host.
