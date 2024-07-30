import { client } from "../index";

const run = async () => {
  try {
    await client.connect();

    await client.query(`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS products CASCADE;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email TEXT,
      password TEXT
    );

    CREATE TABLE carts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      title VARCHAR(100),
      price MONEY,
      quantity INTEGER
    );
    `);

    const data = await client.query(`SELECT * FROM users;`);
  } catch (error) {
    console.error(`Something has gone wrong: ${error}`);
  }
};

run().then(() => client.end());
