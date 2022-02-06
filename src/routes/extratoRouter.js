import { Router } from "express";
import {
  enviarEntrada,
  buscarExtrato,
  enviarSaida,
} from "../controllers/extratoController.js";

const extratoRouter = Router();

extratoRouter.post("/entrada", enviarEntrada);
extratoRouter.post("/saida", enviarSaida);
extratoRouter.get("/menu", buscarExtrato);

export default extratoRouter;
