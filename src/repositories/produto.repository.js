import { knex } from "../database/knex.js";

class RepositoryProdutos {
  async getAll(nome = "") {
    const query = knex("produtos").select("*").orderBy("id");

    if (nome.trim()) {
      query.whereILike("nome", `%${nome.trim()}%`);
    }

    return await query;
  }

  async getById(id) {
    return await knex("produtos").where({ id }).first();
  }

  async getByName(nome) {
    return await knex("produtos")
      .whereRaw("LOWER(nome) = LOWER(?)", [nome])
      .first();
  }

  async create(data) {
    const [produtoCriado] = await knex("produtos").insert(data).returning("*");
    return produtoCriado;
  }

  async updatePut(id, data) {
    const [produtoAtualizado] = await knex("produtos")
      .where({ id })
      .update(data)
      .returning("*");

    return produtoAtualizado;
  }

  async delete(id) {
    const [produtoDeletado] = await knex("produtos")
      .where({ id })
      .del()
      .returning("*");

    return produtoDeletado;
  }
}

export const repositoryProdutos = new RepositoryProdutos();
