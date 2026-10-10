import mysql from 'mysql2/promise';

// Create connection pool for database operations
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'gavran_poultry_dev',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

// Validate database connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    throw err;
  });

export default pool;