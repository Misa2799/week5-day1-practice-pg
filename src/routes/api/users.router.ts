import { Router, Request, Response } from "express";
import { pool } from "../../db";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export const router = Router();

// /api/v1/users
router.get("/", async (req: Request, res: Response) => {
  const data = await pool.query<User>("SELECT * FROM users");
  res.send(data.rows);

  console.log("data", data);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await pool.query<User>(`SELECT * FROM users WHERE id = $1;`, [
    id,
  ]);

  const user = data.rows[0];
  if (!user) {
    res
      .status(404)
      .json({ error: 404, message: `User with ID ${id} does not exist` });
  }

  res.send(user);
});

router.post("/", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  await pool.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
    [name, email, password]
  );
  res.send("");
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const { name, email, password } = req.body;
  const response = await pool.query(
    `UPDATE users SET name = $1, email = $2, password = $3
    WHERE id = $4 RETURNING *;`,
    [name, email, password, id]
  );

  const data = response.rows;
  res.send(data);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await pool.query(
    `
    DELETE FROM users WHERE id = $1 RETURNING *;
    `,
    [id]
  );

  const data = response.rows;
  res.send(data);
});
