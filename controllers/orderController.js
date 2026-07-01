const db = require('../config/db');

exports.checkout = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { customer_name, customer_phone, items } = req.body;
        
        let total_amount = 0;
        let order_details_text = `*New Order from ${customer_name}*\n`;
        
        // Calculate total and prepare message
        for (const item of items) {
            const [productRows] = await connection.query('SELECT name, price FROM products WHERE id = ?', [item.product_id]);
            if (productRows.length > 0) {
                const product = productRows[0];
                const itemTotal = product.price * item.quantity;
                total_amount += itemTotal;
                order_details_text += `- ${product.name} (x${item.quantity}) : Rp ${itemTotal}\n`;
            }
        }
        
        order_details_text += `\n*Total: Rp ${total_amount}*\n`;
        
        // Insert Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (customer_name, customer_phone, total_amount, status) VALUES (?, ?, ?, ?)',
            [customer_name, customer_phone, total_amount, 'pending']
        );
        const orderId = orderResult.insertId;
        
        // Insert Order Items
        for (const item of items) {
            const [productRows] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
            if (productRows.length > 0) {
                await connection.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, productRows[0].price]
                );
            }
        }
        
        await connection.commit();
        
        // Generate WhatsApp link (Owner phone hardcoded or from env)
        const ownerPhone = process.env.OWNER_PHONE || '6281234567890';
        const encodedMessage = encodeURIComponent(order_details_text);
        const waLink = `https://wa.me/${ownerPhone}?text=${encodedMessage}`;
        
        res.status(201).json({
            success: true,
            message: 'Checkout successful',
            data: { orderId, total_amount, waLink }
        });
        
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
