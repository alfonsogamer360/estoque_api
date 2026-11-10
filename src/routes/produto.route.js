import { Router } from "express";
import { controllerProdutos } from "../controllers/produto.controller.js";

export const routerProdutos = Router();

routerProdutos.get("/", controllerProdutos.getAll);
routerProdutos.get("/:id", controllerProdutos.getById);
routerProdutos.post("/", controllerProdutos.create);
routerProdutos.put("/:id", controllerProdutos.updatePut);
routerProdutos.patch("/:id/desconto", controllerProdutos.applyDiscount);
routerProdutos.delete("/:id", controllerProdutos.delete);
