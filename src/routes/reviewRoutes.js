const express = require('express');
const router = express.Router();
const {
    createReview,
    getReviewById,
    updateReview,
    deleteReview,
    getAllReviews,
    getReviewsByBlog,
} = require('../controllers/reviewController');

// Get all reviews
router.get("/", getAllReviews);

// Get a review by ID
router.get("/:id", getReviewById);

// Get all reviews for a blog
router.get("/blog/:blogId", getReviewsByBlog);

// Create a new review
router.post("/", createReview);

// Update a review by ID
router.put("/:id", updateReview);

// Delete a review by ID
router.delete("/:id", deleteReview);

module.exports = router;
