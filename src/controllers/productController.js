const axios = require('axios');
const Product = require("../models/ProductModel");



// Fech Prodcut from api
const storeName = "Krishna";
const fetchAndSaveProducts = async (req, res) => {
    try {
        const response = await axios.get("https://fakestoreapi.com/products");
        const productsWithStore = response.data.map((product) => ({
            ...product,
            storeName: storeName, // Add storeName field
        }));

        // Save to MongoDB
        await Product.insertMany(productsWithStore);

        res.status(200).json({ message: "Products saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving products", error: error.message });
    }
};

// Create a product manually
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body); // Create a new product instance from request body
        await newProduct.save(); // Save to MongoDB
        res.status(201).json({ message: "Product created successfully!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};
// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }); // Fetch only active products
        res.status(200).json({
            message: "Active products fetched successfully!",
            products, // Sending products in response
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id); // Fetch product from DB
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// delete product
const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { isActive: false }, 
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product soft deleted successfully!", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

// Get product categories
const getProductCategories = async (req, res) => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products/categories');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category products", error: error.message });
    }
};

// Get carts by user ID
const getCartsByUser = async (req, res) => {
    try {
        const { userId } = req.query;
        const response = await axios.get(`https://fakestoreapi.com/carts?userId=${userId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching carts", error: error.message });
    }
};

// Get limited number of products
const getLimitedProducts = async (req, res) => {
    try {
        const { limit } = req.query;
        const response = await axios.get(`https://fakestoreapi.com/products?limit=${limit}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching limited products", error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductCategories,
    getProductsByCategory,
    getCartsByUser,
    getLimitedProducts,
    fetchAndSaveProducts,
    createProduct,
    deleteProductById,
};
