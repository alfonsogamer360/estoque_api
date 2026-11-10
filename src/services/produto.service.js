import { repositoryProdutos } from "../repositories/produto.repository.js";

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

class ServicesProdutos {
  validarProduto(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw criarErro("Envie os dados do produto em formato JSON", 400);
    }

    const { nome, preco, quantidade } = data;

    if (typeof nome !== "string" || !nome.trim()) {
      throw criarErro("O nome é obrigatório", 400);
    }

    if (typeof preco !== "number" || !Number.isFinite(preco) || preco < 0) {
      throw criarErro("O preço deve ser um número válido", 400);
    }

    if (!Number.isInteger(quantidade) || quantidade < 0) {
      throw criarErro("A quantidade deve ser um inteiro maior ou igual a zero", 400);
    }

    return { nome: nome.trim(), preco, quantidade };
  }

  async getAll(nome) {
    return await repositoryProdutos.getAll(nome);
  }

  async getById(id) {
    const produto = await repositoryProdutos.getById(id);

    if (!produto) {
      throw criarErro("Produto não encontrado", 404);
    }

    return produto;
  }

  async create(data) {
    const produto = this.validarProduto(data);
    const existente = await repositoryProdutos.getByName(produto.nome);

    if (existente) {
      throw criarErro("Já existe um produto com esse nome", 409);
    }

    return await repositoryProdutos.create(produto);
  }

  async updatePut(id, data) {
    await this.getById(id);

    const produto = this.validarProduto(data);
    const existente = await repositoryProdutos.getByName(produto.nome);

    if (existente && Number(existente.id) !== id) {
      throw criarErro("Já existe um produto com esse nome", 409);
    }

    return await repositoryProdutos.updatePut(id, produto);
  }

  async delete(id) {
    const produto = await this.getById(id);

    if (produto.quantidade > 0) {
      throw criarErro("Não é possível excluir produto com estoque maior que zero", 422);
    }

    return await repositoryProdutos.delete(id);
  }

  async applyDiscount(id, percentual) {
    const produto = await this.getById(id);

    if (
      typeof percentual !== "number" ||
      !Number.isFinite(percentual) ||
      percentual <= 0 ||
      percentual > 50
    ) {
      throw criarErro("O percentual deve ser maior que zero e menor ou igual a 50", 400);
    }

    const precoAtual = Number(produto.preco);
    const novoPreco = Number((precoAtual * (1 - percentual / 100)).toFixed(2));

    return await repositoryProdutos.updatePut(id, { preco: novoPreco });
  }
}

export const servicesProdutos = new ServicesProdutos();
