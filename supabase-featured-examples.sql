-- ==============================================================================
-- DESTACADOS: 12 EJEMPLOS - TERRA CREACIONES
-- ==============================================================================
-- Ejecutar en el SQL Editor de Supabase. Agrega los 4 productos de ejemplo que
-- faltan para llegar a 12 y los marca como destacados. No borra nada.
-- (También se puede hacer desde Admin → Productos → "Completar 12 destacados").
-- ==============================================================================

INSERT INTO products (slug, name, description, shape, featured, category_id)
SELECT v.slug, v.name, v.descr, v.shape, true, c.id
FROM (VALUES
  ('bolso-luna', 'Bolso Luna', 'Bolso redondo con detalle de luna bordada y cadena delicada.', 'BAG', 'bolsos'),
  ('cartera-petalo', 'Cartera Pétalo', 'Cartera de solapa redondeada con flores diminutas tejidas.', 'WALLET', 'carteras'),
  ('amigurumi-flor', 'Amigurumi Flor', 'Flor tejida a mano con tallo flexible, ideal como regalo.', 'TOY', 'otros'),
  ('posavasos-duo', 'Set Posavasos Duo', 'Dos posavasos translatorios con espiral en tonos suaves.', 'COASTER', 'otros')
) AS v(slug, name, descr, shape, cat)
JOIN categories c ON c.slug = v.cat
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_colors (product_id, position, color_id)
SELECT p.id, v.pos, c.id FROM (VALUES
  ('bolso-luna',0,'Lila'),('bolso-luna',1,'Crema'),('bolso-luna',2,'Plata'),
  ('cartera-petalo',0,'Rosa'),('cartera-petalo',1,'Crema'),('cartera-petalo',2,'Salvia'),
  ('amigurumi-flor',0,'Manteca'),('amigurumi-flor',1,'Rosa'),('amigurumi-flor',2,'Menta'),
  ('posavasos-duo',0,'Celeste'),('posavasos-duo',1,'Crema'),('posavasos-duo',2,'Durazno')
) AS v(slug, pos, color)
JOIN products p ON p.slug = v.slug
JOIN colors c ON c.name = v.color
ON CONFLICT (product_id, position) DO NOTHING;

INSERT INTO product_features (product_id, position, feature)
SELECT p.id, v.pos, v.feature FROM (VALUES
  ('bolso-luna',0,'Cierre con broche'),('bolso-luna',1,'Medidas: 24 x 24 cm (ejemplo)'),
  ('cartera-petalo',0,'Forro de algodón'),('cartera-petalo',1,'Cierre magnético'),
  ('amigurumi-flor',0,'Altura: 12 cm (ejemplo)'),
  ('posavasos-duo',0,'Set de 2 unidades'),('posavasos-duo',1,'Lavables a mano')
) AS v(slug, pos, feature)
JOIN products p ON p.slug = v.slug
ON CONFLICT (product_id, position) DO NOTHING;

-- Marca destacados los 12 ejemplos (si hay más productos, se suman sin sacar destacados).
UPDATE products
SET featured = true
WHERE slug IN (
  'bolso-sol', 'bolso-mar', 'bolso-flor',
  'cartera-nube', 'cartera-durazno', 'cartera-brisa',
  'llavero-osito', 'posavasos-flor',
  'bolso-luna', 'cartera-petalo', 'amigurumi-flor', 'posavasos-duo'
);

SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM products));
