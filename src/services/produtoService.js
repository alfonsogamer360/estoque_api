const repository = require("../repositories/produtoRepository");

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validarProduto(dados) {
  const { nome, preco, quantidade } = dados;

  if (typeof nome !== "string" || !nome.trim()) {
    throw criarErro("O nome é obrigatório", 400);
  }

  if (typeof preco !== "number" || !Number.isFinite(preco) || preco < 0) {
    throw criarErro("O preço deve ser um número válido", 400);
  }

  if (!Number.isInteger(quantidade) || quantidade < 0) {
    throw criarErro("A quantidade deve ser um inteiro maior ou igual a zero", 400);
  }

  return {
    nome: nome.trim(),
    preco,
    quantidade,
  };
}

async function listar(nome) {
  return await repository.listar(nome);
}

async function buscarPorId(id) {
  const produto = await repository.buscarPorId(id);

  if (!produto) {
    throw criarErro("Produto não encontrado", 404);
  }

  return produto;
}

async function criar(dados) {
  const produto = validarProduto(dados);

  const existente = await repository.buscarPorNome(produto.nome);

  if (existente) {
    throw criarErro("Já existe um produto com esse nome", 409);
  }

  return await repository.criar(produto);
}

async function atualizar(id, dados) {
  await buscarPorId(id);

  const produto = validarProduto(dados);

  const existente = await repository.buscarPorNome(produto.nome);

  if (existente && existente.id !== id) {
    throw criarErro("Já existe um produto com esse nome", 409);
  }

  return await repository.atualizar(id, produto);
}

async function excluir(id) {
  const produto = await buscarPorId(id);

  if (produto.quantidade > 0) {
    throw criarErro("Não é possível excluir produto com estoque maior que zero", 422);
  }

  await repository.excluir(id);
}

async function aplicarDesconto(id, percentual) {
  const produto = await buscarPorId(id);

  if (typeof percentual !== "number" || !Number.isFinite(percentual) || percentual <= 0 || percentual > 50) {
    throw criarErro("O percentual deve ser maior que zero e menor ou igual a 50", 400);
  }

  const desconto = produto.preco * (percentual / 100);
  const novoPreco = Number((produto.preco - desconto).toFixed(2));

  const atualizado = await repository.atualizar(id, { ...produto, preco: novoPreco });
  return atualizado;
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir,
  aplicarDesconto,
};
