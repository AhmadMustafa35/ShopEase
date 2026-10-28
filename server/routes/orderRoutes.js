const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all customer order routes
router.use(protect);

router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
