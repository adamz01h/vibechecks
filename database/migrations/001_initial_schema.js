export async function up(knex) {
  await knex.schema.createTable('bank_accounts', table => {
    table.bigIncrements('id').unsigned().primary();
    table.string('nickname',100).notNullable();
    table.string('account_holder',180).notNullable();
    table.string('address1',180); table.string('address2',180); table.string('city',100); table.string('state',50); table.string('postal_code',20);
    table.string('phone',40); table.string('email',180);
    table.string('date_format',20).notNullable().defaultTo('MM/DD/YYYY');
    table.string('bank_name',180).notNullable();
    table.string('routing_number',20).notNullable();
    table.string('account_number',34).notNullable();
    table.integer('next_check_number').unsigned().notNullable().defaultTo(1001);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('payees', table => {
    table.bigIncrements('id').unsigned().primary(); table.string('name',180).notNullable();
    table.string('address1',180); table.string('address2',180); table.string('city',100); table.string('state',50); table.string('postal_code',20);
    table.timestamp('created_at').defaultTo(knex.fn.now()); table.index(['name'],'idx_payee_name');
  });
  await knex.schema.createTable('checks', table => {
    table.bigIncrements('id').unsigned().primary();
    table.bigInteger('bank_account_id').unsigned().notNullable();
    table.bigInteger('payee_id').unsigned().nullable();
    table.integer('check_number').unsigned().notNullable();
    table.date('check_date').notNullable(); table.string('payee_name',180).notNullable();
    table.decimal('amount',12,2).notNullable(); table.string('amount_words',500).notNullable(); table.string('memo',255);
    table.enu('status',['draft','printed','void','cleared']).notNullable().defaultTo('draft');
    table.dateTime('printed_at'); table.dateTime('cleared_at');
    table.timestamp('created_at').defaultTo(knex.fn.now()); table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['bank_account_id','check_number'],'uq_account_check');
    table.foreign('bank_account_id').references('bank_accounts.id');
    table.foreign('payee_id').references('payees.id').onDelete('SET NULL');
  });
}
export async function down(knex) {
  await knex.schema.dropTableIfExists('checks');
  await knex.schema.dropTableIfExists('payees');
  await knex.schema.dropTableIfExists('bank_accounts');
}
