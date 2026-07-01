const db = require('../config/db');

exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ success: true, message: 'Category created', data: { id: result.insertId, name } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await db.query('UPDATE categories SET name=? WHERE id=?', [name, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, message: 'Category updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM categories WHERE id=?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
