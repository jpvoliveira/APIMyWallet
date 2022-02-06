import { Router } from "express";
import { cadastro, login } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/cadastro", cadastro);
authRouter.post("/login", login);

export default authRouter;
