// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middlewares/authMiddleware');
// const { getCart, addToCart } = require('../controllers/cartController');

// // Protected Routes
// router.get('/', authMiddleware, getCart);
// router.post('/add', authMiddleware, addToCart);

// module.exports = router;


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

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.delete('/remove/:id', authMiddleware, removeFromCart);
router.patch('/increase/:id', authMiddleware, increaseQuantity);
router.patch('/decrease/:id', authMiddleware, decreaseQuantity);
router.delete('/clear', authMiddleware, clearCart);

module.exports = router;
