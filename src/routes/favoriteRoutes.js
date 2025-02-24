const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  clearFavorites 
} = require('../controllers/favoriteController');

// Protected Routes
router.get('/', authMiddleware, getFavorites);
router.post('/add', authMiddleware, addToFavorites);
router.delete('/remove/:id', authMiddleware, removeFromFavorites);
router.delete('/clear', authMiddleware, clearFavorites);

module.exports = router;
