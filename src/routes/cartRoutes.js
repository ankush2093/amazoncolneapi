const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} = require('../controllers/cartController');

// Get user's cart
router.get('/', authMiddleware, getCart);

// Add a product to cart
router.post('/add', authMiddleware, addToCart);

// Remove a product from cart
router.delete('/:id', authMiddleware, removeFromCart);

// Increase and decrease quantity
router.patch('/:id/increase', authMiddleware, increaseQuantity);
router.patch('/:id/decrease', authMiddleware, decreaseQuantity);

// Clear cart
router.delete('/clear', authMiddleware, clearCart);

module.exports = router;
