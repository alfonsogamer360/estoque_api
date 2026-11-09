const db = require("../config/database");

async function listar(nome = "") {
  const query = db("produtos").select("*").orderBy("id");

  if (nome) {
    return await query.whereILike("nome", `%${nome}%`);
  }

  return await query;
}

async function buscarPorId(id) {
  return await db("produtos").where({ id }).first();
}

async function buscarPorNome(nome) {
  return await db("produtos").whereRaw("LOWER(nome) = LOWER(?)", [nome]).first();
}

async function criar(produto) {
  const [novoProduto] = await db("produtos").insert(produto).returning("*");
  return novoProduto;
}

async function atualizar(id, dados) {
  const [produtoAtualizado] = await db("produtos").where({ id }).update(dados).returning("*");
  return produtoAtualizado;
}

async function excluir(id) {
  return await db("produtos").where({ id }).del();
}

module.exports = {
  listar,
  buscarPorId,
  buscarPorNome,
  criar,
  atualizar,
  excluir,
};
