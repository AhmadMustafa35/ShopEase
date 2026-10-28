const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all cart routes
router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeCartItem);

module.exports = router;
