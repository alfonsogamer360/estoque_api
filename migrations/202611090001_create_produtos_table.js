exports.up = async function (knex) {
  await knex.schema.createTable("produtos", function (table) {
    table.increments("id").primary();
    table.string("nome", 150).notNullable().unique();
    table.decimal("preco", 10, 2).notNullable();
    table.integer("quantidade").notNullable().defaultTo(0);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("produtos");
};
