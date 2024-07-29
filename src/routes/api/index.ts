import { Router } from "express";
import { router as usersRouter } from "./users.router";

export const apiRouter = Router();

apiRouter.use("/users", usersRouter);

// const ROUTER = [{ url: "/users", router: usersRouter }];

// ROUTER.forEach(({ url, router }) => {
//   apiRouter.use(url, router);
// });
