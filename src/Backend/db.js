// db.js
import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'P@ssw0rd',
  database: 'recette',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
