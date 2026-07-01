const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.checkout); // For /api/checkout and /api/orders
router.get('/', orderController.getAllOrders);

module.exports = router;
