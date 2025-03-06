// const express = require("express");
// const {
//   getCart,
//   syncCart,
//   addToCart,
//   removeFromCart,
//   updateQuantity,
//   clearCart,
//   toggleFavorite,
// } = require("../controllers/cartController");

// const authMiddleware = require("../middlewares/authMiddleware");


// const router = express.Router();

// router.get("/:userId",authMiddleware, getCart);
// router.post("/sync",authMiddleware, syncCart);
// router.post("/add",authMiddleware, addToCart);
// router.post("/remove",authMiddleware, removeFromCart);
// router.post("/update-quantity",authMiddleware, updateQuantity);
// router.post("/clear",authMiddleware, clearCart);
// router.post("/favorite", authMiddleware, toggleFavorite);

// module.exports = router;






const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware'); // Your auth middleware

router.get('/:userId', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addToCart);
router.post('/remove', authMiddleware, cartController.removeFromCart);
router.post('/update-quantity', authMiddleware, cartController.updateQuantity);
router.post('/clear', authMiddleware, cartController.clearCart);
router.post('/favorite', authMiddleware, cartController.toggleFavorite);
router.post('/sync', authMiddleware, cartController.syncCart);

module.exports = router;