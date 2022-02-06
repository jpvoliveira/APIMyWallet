import { Router } from "express";
import authRouter from "./authRouter.js";
import extratoRouter from "./extratoRouter.js";

const router = Router();
router.use(authRouter);
router.use(extratoRouter);

export default router;
