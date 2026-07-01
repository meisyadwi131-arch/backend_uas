const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) return res.status(403).json({ success: false, message: 'No token provided.' });

    // Format: "Bearer <token>"
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
        if (err) return res.status(401).json({ success: false, message: 'Unauthorized.' });
        req.user = decoded; // { id, role, username }
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Requires Admin Role!' });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};
