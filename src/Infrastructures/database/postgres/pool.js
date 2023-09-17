/* istanbul ignore file */
/**
 * Komentar kode istanbul ignore file berfungsi untuk memberitahu Jest bahwa berkas ini (pool.js) tidak perlu diuji. Berkas ini akan diabaikan oleh jest dan tidak akan masuk ke dalam laporan coverage test.
 */
const { Pool } = require('pg');
 
const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
};
 
const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();
 
module.exports = pool;