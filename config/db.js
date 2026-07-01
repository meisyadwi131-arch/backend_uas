const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
// Railway typically provides a connection string via MYSQL_URL or similar, 
// but we'll support both options for flexibility.
const pool = mysql.createPool(
    process.env.RAILWAY_MYSQL_URL || {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'db_uas_store',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
);

// Check connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the database.');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

module.exports = pool;
