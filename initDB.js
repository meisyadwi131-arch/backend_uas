const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function initDB() {
    try {
        console.log('Checking database tables...');
        const [rows] = await db.query("SHOW TABLES LIKE 'products'");
        
        if (rows.length === 0) {
            console.log('Tables not found. Initializing database from database.sql...');
            const sqlFilePath = path.join(__dirname, 'database.sql');
            let sqlFile = fs.readFileSync(sqlFilePath, 'utf8');
            
            // Remove comments and split by semicolon
            const queries = sqlFile
                .replace(/--.*$/gm, '') // Remove single-line comments
                .split(';')
                .map(q => q.trim())
                .filter(q => q.length > 0);
            
            for (let query of queries) {
                // Skip USE database command as Railway provides direct db connection
                if (query.toUpperCase().startsWith('USE ') || query.toUpperCase().startsWith('CREATE DATABASE ')) {
                    continue;
                }
                await db.query(query);
            }
            console.log('Database initialized successfully!');
        } else {
            console.log('Database tables already exist. Skipping initialization.');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

module.exports = initDB;
