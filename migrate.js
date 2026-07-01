const db = require('./config/db');

async function migrate() {
    try {
        console.log('Altering products table to support Base64 images...');
        await db.query('ALTER TABLE products MODIFY COLUMN image_url LONGTEXT');
        
        console.log('Updating dummy products to use working images...');
        const img1 = 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80';
        const img2 = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80';
        
        await db.query('UPDATE products SET image_url = ? WHERE id = 1', [img1]);
        await db.query('UPDATE products SET image_url = ? WHERE id = 2', [img2]);
        
        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        process.exit();
    }
}

migrate();
