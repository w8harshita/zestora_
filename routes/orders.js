const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById,
  cancelOrder, updateOrderStatus, getAllOrders
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect); // All order routes require authentication

router.post('/place', placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', adminOnly, updateOrderStatus);
router.get('/', adminOnly, getAllOrders);

module.exports = router;
