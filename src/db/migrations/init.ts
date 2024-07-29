import { client } from "../index";

const run = async () => {
  try {
    await client.connect();

    await client.query(`
    DROP TABLE IF EXISTS users CASCADE;

    CREATE TABLE users (
      id: SERIAL PRIMARY KEY,
      name: VARCHAR(100),
      email: TEXT,
      password: TEXT
    );
    `);

    const data = await client.query(`SELECT * FROM users;`);
  } catch (error) {
    console.error(`Something has gone wrong: ${error}`);
  }
};

run().then(() => client.end());
