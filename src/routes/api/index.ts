import { Router } from "express";
import { router as usersRouter } from "./users.router";
import { router as cartsRouter } from "./carts.router";

export const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/users/:userId/carts", cartsRouter);

// const ROUTER = [{ url: "/users", router: usersRouter }];

// ROUTER.forEach(({ url, router }) => {
//   apiRouter.use(url, router);
// });
