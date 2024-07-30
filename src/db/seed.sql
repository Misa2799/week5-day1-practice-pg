INSERT INTO users (name, email, password)
VALUES 
  ('John Doe', 'johndoe@gmail.com', '1234'),
  ('Alice Wonderland', 'alice@gmail.com', '5678'),
  ('Simba King', 'simba-king-1@gmail.com', '9012');

  INSERT INTO cart (user_id, title, price, quantity)
  VALUES 
  (1, 'shirt', 50, 1),
  (2, 'pants', 100, 1),
  (3, 'shoes', 80, 1);