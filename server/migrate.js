import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

const config={host:process.env.DB_HOST||'127.0.0.1',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER||'vibechecks',password:process.env.DB_PASSWORD||'',database:process.env.DB_NAME||'vibechecks',multipleStatements:true};
const db=await mysql.createConnection(config);
try{
 await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (name VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
 const dir=path.resolve('database/migrations');
 const files=(await fs.readdir(dir)).filter(x=>/^\d+.*\.sql$/.test(x)).sort();
 for(const name of files){
  const [[done]]=await db.execute('SELECT name FROM schema_migrations WHERE name=?',[name]);
  if(done)continue;
  const sql=await fs.readFile(path.join(dir,name),'utf8');
  await db.beginTransaction();
  try{await db.query(sql);await db.execute('INSERT INTO schema_migrations(name) VALUES(?)',[name]);await db.commit();console.log('Applied migration',name)}
  catch(e){await db.rollback();throw e}
 }
}finally{await db.end()}
