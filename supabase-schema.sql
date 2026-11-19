-- ==============================================================================
-- TERRA CREACIONES - ESQUEMA, POLÍTICAS RLS Y DATOS INICIALES PARA SUPABASE
-- ==============================================================================
-- Copiá y pegá todo este script en el "SQL Editor" de tu proyecto de Supabase
-- y presioná "Run".
-- ==============================================================================

-- 1. TABLAS PRINCIPALES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  emoji VARCHAR(16) DEFAULT '🧶'
);

CREATE TABLE IF NOT EXISTS colors (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  hex VARCHAR(7) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  shape VARCHAR(20) NOT NULL DEFAULT 'BAG',
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS product_features (
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INT NOT NULL,
  feature VARCHAR(200) NOT NULL,
  PRIMARY KEY (product_id, position)
);

CREATE TABLE IF NOT EXISTS product_colors (
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INT NOT NULL,
  color_id BIGINT NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, position)
);

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT PRIMARY KEY,
  whatsapp VARCHAR(30) NOT NULL,
  address VARCHAR(200) NOT NULL,
  hours VARCHAR(200) NOT NULL
);

-- 2. ACTIVAR ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE LECTURA PÚBLICA (Cualquier visitante puede ver el catálogo)
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS "Lectura pública categories" ON categories;
CREATE POLICY "Lectura pública categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública colors" ON colors;
CREATE POLICY "Lectura pública colors" ON colors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública products" ON products;
CREATE POLICY "Lectura pública products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública product_features" ON product_features;
CREATE POLICY "Lectura pública product_features" ON product_features FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública product_colors" ON product_colors;
CREATE POLICY "Lectura pública product_colors" ON product_colors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lectura pública site_settings" ON site_settings;
CREATE POLICY "Lectura pública site_settings" ON site_settings FOR SELECT USING (true);

-- 4. POLÍTICAS DE ESCRITURA PARA ADMINS (Solo usuarios con rol ADMIN)
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS "Admin write categories" ON categories;
CREATE POLICY "Admin write categories" ON categories FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');

DROP POLICY IF EXISTS "Admin write colors" ON colors;
CREATE POLICY "Admin write colors" ON colors FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');

DROP POLICY IF EXISTS "Admin write products" ON products;
CREATE POLICY "Admin write products" ON products FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');

DROP POLICY IF EXISTS "Admin write product_features" ON product_features;
CREATE POLICY "Admin write product_features" ON product_features FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');

DROP POLICY IF EXISTS "Admin write product_colors" ON product_colors;
CREATE POLICY "Admin write product_colors" ON product_colors FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');

DROP POLICY IF EXISTS "Admin write site_settings" ON site_settings;
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');

-- 5. BUCKET DE SUPABASE STORAGE (Para fotos de productos)
-- ------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Lectura pública de fotos" ON storage.objects;
CREATE POLICY "Lectura pública de fotos"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Subida de fotos para administradores" ON storage.objects;
CREATE POLICY "Subida de fotos para administradores"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- 6. DATOS INICIALES (SEED DATA)
-- ------------------------------------------------------------------------------

INSERT INTO site_settings (id, whatsapp, address, hours)
VALUES (1, '5490000000000', '[Dirección del local], [Ciudad]', 'Lunes a sábados, 9 a 13 h y 16 a 20 h')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (slug, name, emoji) VALUES
  ('bolsos', 'Bolsos', '👜'),
  ('carteras', 'Carteras', '👛'),
  ('otros', 'Otros', '🧶')
ON CONFLICT (slug) DO UPDATE SET emoji = EXCLUDED.emoji, name = EXCLUDED.name;

INSERT INTO colors (id, name, hex) VALUES
  (1, 'Lila', '#d9c4f0'),
  (2, 'Menta', '#c5ebd9'),
  (3, 'Durazno', '#fbcfb8'),
  (4, 'Manteca', '#f7e29b'),
  (5, 'Celeste', '#bcdaf4'),
  (6, 'Rosa', '#f6c3d6'),
  (7, 'Crema', '#fbf3e4'),
  (8, 'Salvia', '#bfd8bd'),
  (9, 'Blanco roto', '#f0ebf3')
ON CONFLICT (id) DO NOTHING;

-- Ajustar la secuencia de colores al máximo id
SELECT setval('colors_id_seq', (SELECT COALESCE(MAX(id), 1) FROM colors));

-- Productos de muestra
INSERT INTO products (slug, name, description, shape, featured, category_id)
SELECT v.slug, v.name, v.descr, v.shape, v.featured, c.id
FROM (VALUES
  ('bolso-sol', 'Bolso Sol', 'Bolso grande tejido en punto rombo, ideal para el día a día. Asas reforzadas.', 'BAG', true, 'bolsos'),
  ('bolso-mar', 'Bolso Mar', 'Tote liviano con franjas suaves, forrado por dentro con cierre.', 'BAG', false, 'bolsos'),
  ('bolso-flor', 'Bolso Flor', 'Bolso con flores aplicadas a mano en cada costado.', 'BAG', false, 'bolsos'),
  ('cartera-nube', 'Cartera Nube', 'Cartera chica con solapa y cierre magnético, entra lo justo y necesario.', 'WALLET', true, 'carteras'),
  ('cartera-durazno', 'Cartera Durazno', 'Cartera mediana con correa larga para llevar cruzada.', 'WALLET', false, 'carteras'),
  ('cartera-brisa', 'Cartera Brisa', 'Monedero y tarjetero en una sola pieza, tejido compacto.', 'WALLET', false, 'carteras'),
  ('llavero-osito', 'Llavero Osito', 'Amigurumi de 7 cm con argolla metálica. Se pide por color.', 'TOY', true, 'otros'),
  ('posavasos-flor', 'Posavasos Flor', 'Set de 4 posavasos en forma de flor, lavables.', 'COASTER', true, 'otros')
) AS v(slug, name, descr, shape, featured, cat)
JOIN categories c ON c.slug = v.cat
ON CONFLICT (slug) DO NOTHING;

-- Colores asignados a productos de muestra
INSERT INTO product_colors (product_id, position, color_id)
SELECT p.id, v.pos, c.id FROM (VALUES
  ('bolso-sol',0,'Manteca'),('bolso-sol',1,'Crema'),('bolso-sol',2,'Durazno'),
  ('bolso-mar',0,'Celeste'),('bolso-mar',1,'Menta'),('bolso-mar',2,'Crema'),
  ('bolso-flor',0,'Rosa'),('bolso-flor',1,'Lila'),('bolso-flor',2,'Crema'),('bolso-flor',3,'Salvia'),
  ('cartera-nube',0,'Lila'),('cartera-nube',1,'Blanco roto'),
  ('cartera-durazno',0,'Durazno'),('cartera-durazno',1,'Crema'),('cartera-durazno',2,'Salvia'),
  ('cartera-brisa',0,'Celeste'),('cartera-brisa',1,'Blanco roto'),
  ('llavero-osito',0,'Durazno'),('llavero-osito',1,'Crema'),('llavero-osito',2,'Rosa'),
  ('posavasos-flor',0,'Manteca'),('posavasos-flor',1,'Menta'),('posavasos-flor',2,'Rosa'),('posavasos-flor',3,'Lila')
) AS v(slug, pos, color)
JOIN products p ON p.slug = v.slug
JOIN colors c ON c.name = v.color
ON CONFLICT (product_id, position) DO NOTHING;

-- Características de productos de muestra
INSERT INTO product_features (product_id, position, feature)
SELECT p.id, v.pos, v.feature FROM (VALUES
  ('bolso-sol',0,'Material: algodón (ejemplo)'),('bolso-sol',1,'Medidas: 32 x 28 cm (ejemplo)'),
  ('bolso-mar',0,'Con forro interno y cierre'),
  ('bolso-flor',0,'Flores aplicadas a mano'),
  ('cartera-nube',0,'Cierre magnético'),
  ('cartera-durazno',0,'Correa larga ajustable'),
  ('llavero-osito',0,'Altura: 7 cm'),
  ('posavasos-flor',0,'Set de 4 unidades')
) AS v(slug, pos, feature)
JOIN products p ON p.slug = v.slug
ON CONFLICT (product_id, position) DO NOTHING;

-- ==============================================================================
-- INSTRUCCIONES PARA ACTIVAR TU ROL DE ADMINISTRADOR:
-- ==============================================================================
-- 1. Registrate normalmente en la web desde "👤 Ingresar" -> "Soy nuevo".
-- 2. Vení aquí al SQL Editor de Supabase y ejecutá esta línea con tu email:
--
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "ADMIN"}'::jsonb
-- WHERE email = 'tu_email@ejemplo.com';
--
-- 3. Cerrá sesión y volvé a ingresar. ¡Aparecerá el botón "⚙️ Admin"!
