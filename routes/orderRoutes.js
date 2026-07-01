const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', orderController.checkout); // Anyone can checkout, but frontend can pass user_id if logged in
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.get('/my-orders', verifyToken, orderController.getMyOrders);

module.exports = router;
