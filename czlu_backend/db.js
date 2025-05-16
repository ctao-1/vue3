// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  dbname:'postgres', // 你的数据库名
  password: '123456',
  port: 5432,
});

module.exports = pool;
