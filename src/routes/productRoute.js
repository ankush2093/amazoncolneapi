const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.post('/create',productController.createProduct);
router.delete('/delete/:id',productController. deleteProductById);
router.get('/fetch-products', productController.fetchAndSaveProducts);
router.get('/products/:id', productController.getProductById);
router.get('/products/categories', productController.getProductCategories);
router.get('/products/category/:category', productController.getProductsByCategory);
router.get('/carts', productController.getCartsByUser);
router.get('/products', productController.getLimitedProducts);

module.exports = router;
