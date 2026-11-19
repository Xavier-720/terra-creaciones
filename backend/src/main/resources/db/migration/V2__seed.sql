INSERT INTO site_settings (id, whatsapp, address, hours) VALUES
  (1, '5490000000000', '[Dirección del local], [Ciudad]', 'Lunes a sábados, 9 a 13 h y 16 a 20 h');

INSERT INTO categories (slug, name, emoji) VALUES
  ('bolsos', 'Bolsos', '👜'), ('carteras', 'Carteras', '👛'), ('otros', 'Otros', '🧶');

INSERT INTO colors (name, hex) VALUES
  ('Lila', '#d9c4f0'), ('Menta', '#c5ebd9'), ('Durazno', '#fbcfb8'), ('Manteca', '#f7e29b'),
  ('Celeste', '#bcdaf4'), ('Rosa', '#f6c3d6'), ('Crema', '#fbf3e4'), ('Salvia', '#bfd8bd'),
  ('Blanco roto', '#f0ebf3');

INSERT INTO products (slug, name, description, shape, featured, category_id)
SELECT v.slug, v.name, v.descr, v.shape, v.featured, c.id FROM (VALUES
  ('bolso-sol', 'Bolso Sol', 'Bolso grande tejido en punto rombo, ideal para el día a día. Asas reforzadas.', 'BAG', true, 'bolsos'),
  ('bolso-mar', 'Bolso Mar', 'Tote liviano con franjas suaves, forrado por dentro con cierre.', 'BAG', false, 'bolsos'),
  ('bolso-flor', 'Bolso Flor', 'Bolso con flores aplicadas a mano en cada costado.', 'BAG', false, 'bolsos'),
  ('cartera-nube', 'Cartera Nube', 'Cartera chica con solapa y cierre magnético, entra lo justo y necesario.', 'WALLET', true, 'carteras'),
  ('cartera-durazno', 'Cartera Durazno', 'Cartera mediana con correa larga para llevar cruzada.', 'WALLET', false, 'carteras'),
  ('cartera-brisa', 'Cartera Brisa', 'Monedero y tarjetero en una sola pieza, tejido compacto.', 'WALLET', false, 'carteras'),
  ('llavero-osito', 'Llavero Osito', 'Amigurumi de 7 cm con argolla metálica. Se pide por color.', 'TOY', true, 'otros'),
  ('posavasos-flor', 'Posavasos Flor', 'Set de 4 posavasos en forma de flor, lavables.', 'COASTER', true, 'otros')
) AS v(slug, name, descr, shape, featured, cat) JOIN categories c ON c.slug = v.cat;

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
) AS v(slug, pos, color) JOIN products p ON p.slug = v.slug JOIN colors c ON c.name = v.color;

INSERT INTO product_features (product_id, position, feature)
SELECT p.id, v.pos, v.feature FROM (VALUES
  ('bolso-sol',0,'Material: algodón (ejemplo)'),('bolso-sol',1,'Medidas: 32 x 28 cm (ejemplo)'),
  ('bolso-mar',0,'Con forro interno y cierre'),
  ('bolso-flor',0,'Flores aplicadas a mano'),
  ('cartera-nube',0,'Cierre magnético'),
  ('cartera-durazno',0,'Correa larga ajustable'),
  ('llavero-osito',0,'Altura: 7 cm'),
  ('posavasos-flor',0,'Set de 4 unidades')
) AS v(slug, pos, feature) JOIN products p ON p.slug = v.slug;
