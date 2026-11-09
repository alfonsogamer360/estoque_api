const service = require("../services/produtoService");

function obterId(req) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    const erro = new Error("ID inválido");
    erro.status = 400;
    throw erro;
  }

  return id;
}

async function listar(req, res) {
  const nome = req.query.nome ? String(req.query.nome) : "";
  const produtos = await service.listar(nome);
  return res.status(200).json(produtos);
}

async function buscarPorId(req, res) {
  const id = obterId(req);
  const produto = await service.buscarPorId(id);
  return res.status(200).json(produto);
}

async function criar(req, res) {
  const produto = await service.criar(req.body);
  return res.status(201).json(produto);
}

async function atualizar(req, res) {
  const id = obterId(req);
  const produto = await service.atualizar(id, req.body);
  return res.status(200).json(produto);
}

async function excluir(req, res) {
  const id = obterId(req);
  await service.excluir(id);
  return res.status(204).send();
}

async function aplicarDesconto(req, res) {
  const id = obterId(req);
  const produto = await service.aplicarDesconto(id, Number(req.body.percentual));
  return res.status(200).json(produto);
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir,
  aplicarDesconto,
};
