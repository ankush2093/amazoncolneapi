// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');


// router.post('/create',productController.createProduct);
// router.delete('/delete/:id',productController. deleteProductById);
// router.get('/fetch-products', productController.fetchAndSaveProducts);
// router.get('/products/:id', productController.getProductById);
// router.get('/products/categories', productController.getProductCategories);
// router.get('/products/category/:category', productController.getProductsByCategory);
// router.get('/carts', productController.getCartsByUser);
// router.get('/products', productController.getLimitedProducts);

// module.exports = router;




const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// data will come from api to db
router.get('/', productController.fetchAndSaveProducts);

// remins opration for creating product
router.post("/create", productController.createProduct);//

// get all products from db
router.get("/products", productController.getAllProducts);//
router.get("/:id", productController.getProductById);//

router.put("/update/:id", productController.updateProductById);

router.delete("/delete/:id", productController.deleteProductById);//

module.exports = router;



