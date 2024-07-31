import { Router, Request, Response } from "express";
import { pool } from "../../db";

export const router = Router({ mergeParams: true });

// /api/v1/users/:userId/carts
router.get("/", async (req: Request, res: Response) => {
  const { userId } = req.params;

  const userData = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  const user = userData.rows[0];

  if (!user) {
    res
      .status(404)
      .json({ error: 404, message: `User with Id ${userId} does not exist` });
    return;
  }

  const cartData = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
    userId,
  ]);

  res.json(cartData.rows);
});

// /api/v1/users/:userId/carts/:id
router.get("/:cartId", async (req: Request, res: Response) => {
  const { user_id, id } = req.params;

  const userData = await pool.query(`SELECT * FROM users WHERE id = $1;`, [
    user_id,
  ]);

  const user = userData.rows[0];

  if (!user) {
    res
      .status(404)
      .json({ error: 404, message: `User with ID ${user_id} does not exist` });
    return;
  }

  const cartData = await pool.query(
    "SELECT * FROM carts WHERE id = $1 AND user_id = $2",
    [id, user_id]
  );

  const cart = cartData.rows[0];

  if (!cart) {
    res
      .status(404)
      .json({ error: 404, message: `User with ID ${id} does not exist` });
    return;
  }

  res.json(cart);
});

// /api/v1/users/:userId/carts
router.post("/", async (req: Request, res: Response) => {
  const { userId } = req.params;

  const userData = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  const user = userData.rows[0];

  if (!user) {
    res
      .status(404)
      .json({ error: 404, message: `User with Id ${userId} does not exist` });
    return;
  }

  const { user_id, title, price, quantity } = req.body;

  const cartData = await pool.query(
    `INSERT INTO carts (user_id, title, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *;`,
    [user_id, title, price, quantity]
  );
  res.json(cartData.rows[0]);
});

// /api/v1/users/:userId/carts/:cartId
router.put("/:cartId", async (req: Request, res: Response) => {
  const { userId, cartId } = req.params;

  const userData = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  const user = userData.rows[0];

  if (!user) {
    res
      .status(404)
      .json({ error: 404, message: `User with Id ${userId} does not exist` });
    return;
  }

  const cartData = await pool.query(
    "SELECT * FROM carts WHERE id = $1 AND user_id = $2",
    [cartId, userId]
  );

  const cart = cartData.rows[0];

  if (!cart) {
    res
      .status(404)
      .json({ error: 404, message: `user with id ${cartId} does not exist` });
    return;
  }

  const { title, price, quantity } = req.body;

  try {
    const updated = await pool.query(
      `UPDATE carts SET title = $1, price = $2, quantity = $3
    WHERE id = $4 AND user_id = $5 RETURNING *;`,
      [title, price, quantity, cartId, userId]
    );

    res.json(updated.rows[0]);
  } catch (error) {
    console.log("Error deleting user:", error);
  }
});

// /api/v1/users/:userId/carts/:cartId
router.delete("/:cartId", async (req: Request, res: Response) => {
  const { userId, cartId } = req.params;

  const userData = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  const user = userData.rows[0];

  if (!user) {
    res
      .status(404)
      .json({ error: 404, message: `user with Id ${userId} does not exist` });
    return;
  }

  const cartData = await pool.query(
    "SELECT * FROM carts WHERE id = $1 AND user_id = $2",
    [cartId, userId]
  );

  const cart = cartData.rows[0];

  if (!cart) {
    res.status(404).json({
      error: 404,
      message: `user with the cart id ${cartId} does not exist`,
    });
    return;
  }

  const client = await pool.connect();
  await client.query("BEGIN");

  const deletedData = await client.query(
    `
    DELETE FROM carts WHERE id = $1 AND user_id = $2  RETURNING *;
    `,
    [cartId, userId]
  );

  if (deletedData.rows.length > 1) {
    await client.query("ROLLBACK");

    res.status(500).json({
      error: 500,
      message: `something went wrong while deleting the task with id ${cartId}`,
    });
    return;
  }

  await client.query("COMMIT");

  res.json(deletedData.rows[0]);
});
