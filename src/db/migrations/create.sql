DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email TEXT,
  password TEXT
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  title VARCHAR(100),
  price MONEY,
  quantity INTEGER
);