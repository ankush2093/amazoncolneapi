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



