import 'dotenv/config';

export default {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'vibechecks',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vibechecks'
  },
  migrations: {
    directory: './database/migrations',
    extension: 'js',
    tableName: 'knex_migrations'
  }
};
