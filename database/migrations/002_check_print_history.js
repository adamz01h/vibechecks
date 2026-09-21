export async function up(knex) {
  await knex.schema.createTable('check_prints', table => {
    table.bigIncrements('id').unsigned().primary();
    table.bigInteger('check_id').unsigned().notNullable();
    table.string('status_at_print', 20).notNullable();
    table.timestamp('printed_at').notNullable().defaultTo(knex.fn.now());
    table.foreign('check_id').references('checks.id').onDelete('CASCADE');
    table.index(['check_id','printed_at'], 'idx_check_prints_check');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('check_prints');
}
