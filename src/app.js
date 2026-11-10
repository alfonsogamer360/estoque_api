import express from "express";
import { routerProdutos } from "./routes/produto.route.js";

const app = express();

app.use(express.json());

app.use("/produtos", routerProdutos);

app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
  });
});

app.use((erro, req, res, next) => {
  if (erro.code === "23505") {
    return res.status(409).json({
      erro: "Produto já cadastrado",
    });
  }

  const status = erro.status || erro.statusCode || 500;

  if (status >= 500) {
    console.error(erro);
  }

  return res.status(status).json({
    erro: status >= 500 ? "Erro interno do servidor" : erro.message,
  });
});

export default app;
