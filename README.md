# Terra Creaciones · Tejiendo sueños 🧶

Tienda web moderna para catálogo y venta de productos tejidos a mano (bolsos, carteras, amigurumis y accesorios), con integración a Supabase (Auth, Database y Storage), panel de administración interactivo y enlace directo para consultas y pedidos vía WhatsApp.

---

## 🌟 Características Principales

- **Catálogo Interactivo:** Navegación por categorías con íconos personalizados, filtros por categoría y visualización de variantes de color con previsualización ilustrada o fotográfica.
- **Consultas por WhatsApp en 1 Clic:** Botones con mensaje preformateado dinámico según el producto consultado (`wa.me`), adaptado con el formato internacional de Argentina (+54 9 ...).
- **Panel de Administración (CRUD completo):**
  - **Productos:** Crear, editar, alternar destacados para la portada y eliminar (con borrado en cascada de características y variantes de color).
  - **Categorías con selector de íconos:** Creación y edición con selector visual de emojis interactivo.
  - **Paleta de colores:** Selector interactivo de color (HEX) para asociar a los tejidos.
  - **Configuración del local:** Edición de número de WhatsApp, dirección física y horarios de atención.
- **Autenticación Nativa y Seguridad (Supabase Auth & RLS):**
  - Registro e inicio de sesión de usuarios.
  - Políticas de seguridad a nivel de fila (*Row Level Security* - RLS): lectura pública para visitantes de la tienda y permisos de escritura/modificación restringidos exclusivamente al rol `ADMIN`.
- **Diseño Responsivo y Artesanal:** Tipografía cuidada (*Cormorant Garamond* y *Nunito*), soporte para modo claro/oscuro y marcas de agua ilustradas de ovillos y huellitas en el fondo.

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnologías |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, React Router 6, TanStack Query (React Query) |
| **Backend & Base de Datos** | Supabase (PostgreSQL 16, PostgREST API, Supabase Auth, Supabase Storage) |
| **Backend Alternativo (Opcional)** | Java 25, Spring Boot 3.5, Spring Security, JWT, Flyway, Maven, Docker |
| **Estilos** | CSS3 nativo moderno con variables, diseño responsivo y sin dependencias pesadas |

---

## 📁 Estructura del Repositorio

```text
terra-creaciones/
├── frontend/                     # Aplicación SPA (React + TypeScript + Vite)
│   ├── src/
│   │   ├── api/                  # Clientes de Supabase y hooks de React Query
│   │   ├── components/           # Componentes UI reutilizables (Layout, Cards, Icons...)
│   │   ├── context/              # Proveedor de autenticación (AuthContext)
│   │   ├── pages/                # Vistas: Inicio, Categoría, Detalle de Producto, Login
│   │   │   └── admin/            # Panel administrativo (Productos, Categorías, Colores, Local)
│   │   └── types.ts              # Definiciones TypeScript del modelo de negocio
│   ├── .env.example              # Variables de entorno modelo para el frontend
│   └── package.json
├── backend/                      # API REST opcional en Spring Boot / Java
│   ├── src/
│   └── pom.xml
├── supabase-schema.sql           # Script SQL completo: tablas, RLS, Storage y datos semilla
├── docker-compose.yml            # Orquestación con Docker (si se utiliza con backend Java)
└── README.md
```

---

## 🚀 Puesta en Marcha en Desarrollo

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- Un proyecto gratuito en [Supabase](https://supabase.com)

### 1. Configurar Supabase
1. Ingresá a tu proyecto en Supabase y abrí el **SQL Editor**.
2. Copiá y pegá el contenido del archivo [`supabase-schema.sql`](./supabase-schema.sql) y ejecutalo con **Run**. Esto creará:
   - Las tablas: `categories`, `colors`, `products`, `product_features`, `product_colors`, `site_settings`.
   - Las políticas RLS de lectura pública y escritura para administradores.
   - El bucket de almacenamiento `product-images` para las fotos.
   - Los datos de ejemplo iniciales.

### 2. Configurar las Variables de Entorno del Frontend
En la carpeta `frontend/`, creá un archivo `.env` basándote en `.env.example`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon_de_supabase
```

### 3. Instalar dependencias e iniciar el Frontend
```bash
cd frontend
npm install
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173) en tu navegador para ver la tienda en vivo.

---

## 👤 Gestión de Administradores

1. En la tienda web, ingresá a **👤 Ingresar** -> pestaña **Soy nuevo** y registrate con tu correo electrónico.
2. En el **SQL Editor** de tu panel de Supabase, asignate el rol de Administrador ejecutando:
   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = raw_app_meta_data || '{"role": "ADMIN"}'::jsonb
   WHERE email = 'tu_email@ejemplo.com';
   ```
3. Cerrá sesión y volvé a ingresar en la web: aparecerá el botón **⚙️ Admin** en el menú superior con acceso a todo el panel de control.

---

## 📦 Despliegue en Producción (Frontend)

Podés desplegar el frontend gratis en plataformas como **Vercel**, **Netlify** o **Cloudflare Pages**:
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Variables de Entorno:** Agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Realizado con dedicación para **Terra Creaciones**.
