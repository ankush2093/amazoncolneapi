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
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Product created successfully!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Get all active products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });
        res.status(200).json({ message: "Active products fetched successfully!", products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};


// Update product by ID
const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};


// Soft delete a product
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





module.exports = {
    fetchAndSaveProducts ,
    createProduct,
    getAllProducts,
    getProductById,
    deleteProductById,
    updateProductById 
};




