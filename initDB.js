const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function initDB() {
    try {
        console.log('Checking database tables...');
        const [rows] = await db.query("SHOW TABLES LIKE 'users'");
        
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

        // Apply migrations
        try {
            console.log('Running schema migrations...');
            await db.query('ALTER TABLE products MODIFY COLUMN image_url LONGTEXT');
            const img1 = 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80';
            const img2 = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80';
            await db.query('UPDATE products SET image_url = ? WHERE id = 1 AND image_url LIKE "%placeholder%"', [img1]);
            await db.query('UPDATE products SET image_url = ? WHERE id = 2 AND image_url LIKE "%placeholder%"', [img2]);
        } catch(e) {
            console.log('Migration note:', e.message);
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

module.exports = initDB;
