const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if user exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user (default role is customer)
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, 'customer']
        );

        res.status(201).json({ success: true, message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body; // Can be username or email
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate Token
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });

        res.status(200).json({ 
            success: true, 
            token, 
            user: { id: user.id, username: user.username, email: user.email, role: user.role } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.setupAdmin = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        await db.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, 'admin']);
        res.status(200).json({ success: true, message: 'Admin password reset to admin123' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
