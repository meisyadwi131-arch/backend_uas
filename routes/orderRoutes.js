const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/checkout', orderController.checkout);

// Admin only routes
router.get('/', [verifyToken, isAdmin], orderController.getAllOrders);
router.put('/:id/status', [verifyToken, isAdmin], orderController.updateOrderStatus);

module.exports = router;
