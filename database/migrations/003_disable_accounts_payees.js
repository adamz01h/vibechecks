export async function up(knex) {
  await knex.schema.alterTable('bank_accounts', table => {
    table.boolean('is_active').notNullable().defaultTo(true).index();
  });
  await knex.schema.alterTable('payees', table => {
    table.boolean('is_active').notNullable().defaultTo(true).index();
  });
}

export async function down(knex) {
  await knex.schema.alterTable('payees', table => table.dropColumn('is_active'));
  await knex.schema.alterTable('bank_accounts', table => table.dropColumn('is_active'));
}
