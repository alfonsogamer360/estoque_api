import { servicesProdutos } from "../services/produto.service.js";

function obterId(req) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    const erro = new Error("ID inválido");
    erro.status = 400;
    throw erro;
  }

  return id;
}

class ControllerProdutos {
  async getAll(req, res, next) {
    try {
      const nome = typeof req.query.nome === "string" ? req.query.nome : "";
      const produtos = await servicesProdutos.getAll(nome);
      return res.status(200).json(produtos);
    } catch (erro) {
      return next(erro);
    }
  }

  async getById(req, res, next) {
    try {
      const produto = await servicesProdutos.getById(obterId(req));
      return res.status(200).json(produto);
    } catch (erro) {
      return next(erro);
    }
  }

  async create(req, res, next) {
    try {
      const produto = await servicesProdutos.create(req.body);
      return res.status(201).json(produto);
    } catch (erro) {
      return next(erro);
    }
  }

  async updatePut(req, res, next) {
    try {
      const produto = await servicesProdutos.updatePut(obterId(req), req.body);
      return res.status(200).json(produto);
    } catch (erro) {
      return next(erro);
    }
  }

  async delete(req, res, next) {
    try {
      const produto = await servicesProdutos.delete(obterId(req));
      return res.status(200).json(produto);
    } catch (erro) {
      return next(erro);
    }
  }

  async applyDiscount(req, res, next) {
    try {
      const percentual = req.body?.percentual;
      const produto = await servicesProdutos.applyDiscount(obterId(req), percentual);
      return res.status(200).json(produto);
    } catch (erro) {
      return next(erro);
    }
  }
}

export const controllerProdutos = new ControllerProdutos();
