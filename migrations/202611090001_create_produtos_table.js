export async function up(knex) {
  await knex.schema.createTable("produtos", (table) => {
    table.increments("id").primary();
    table.string("nome", 150).notNullable().unique();
    table.decimal("preco", 10, 2).notNullable();
    table.integer("quantidade").notNullable().defaultTo(0);
  });
};

export async function down(knex) {
  await knex.schema.dropTableIfExists("produtos");
}
