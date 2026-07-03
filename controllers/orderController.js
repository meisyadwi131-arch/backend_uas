const db = require('../config/db');
require('dotenv').config();

exports.checkout = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { customer_name, customer_phone, customer_address, items, total_amount } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    await connection.beginTransaction();

    // Insert Order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount) VALUES (?, ?, ?, ?)',
      [customer_name, customer_phone, customer_address, total_amount]
    );
    const orderId = orderResult.insertId;

    let orderDetailsText = \`New Order #\${orderId}\\n\\nName: \${customer_name}\\nPhone: \${customer_phone}\\nAddress: \${customer_address}\\n\\nItems:\\n\`;

    // Insert Order Items and Update Stock
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
      
      orderDetailsText += \`- \${item.name} (\${item.quantity}x) @ Rp \${item.price}\\n\`;
    }

    orderDetailsText += \`\\nTotal: Rp \${total_amount}\\n\\nPlease confirm this order.\`;

    await connection.commit();

    const waNumber = process.env.WHATSAPP_NUMBER || '6281234567890';
    const waLink = \`https://wa.me/\${waNumber}?text=\${encodeURIComponent(orderDetailsText)}\`;

    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId,
      whatsapp_link: waLink
    });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server Error during checkout' });
  } finally {
    connection.release();
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
