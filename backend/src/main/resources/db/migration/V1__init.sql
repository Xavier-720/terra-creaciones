CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  emoji VARCHAR(16)
);
CREATE TABLE colors (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  hex VARCHAR(7) NOT NULL
);
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  shape VARCHAR(20) NOT NULL,
  image_url VARCHAR(255),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  category_id BIGINT NOT NULL REFERENCES categories(id)
);
CREATE TABLE product_features (
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INT NOT NULL,
  feature VARCHAR(200) NOT NULL,
  PRIMARY KEY (product_id, position)
);
CREATE TABLE product_colors (
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INT NOT NULL,
  color_id BIGINT NOT NULL REFERENCES colors(id),
  PRIMARY KEY (product_id, position)
);
CREATE TABLE site_settings (
  id BIGINT PRIMARY KEY,
  whatsapp VARCHAR(30) NOT NULL,
  address VARCHAR(200) NOT NULL,
  hours VARCHAR(200) NOT NULL
);
CREATE TABLE app_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  role VARCHAR(10) NOT NULL
);
