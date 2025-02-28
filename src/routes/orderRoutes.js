const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createOrder, verifyPayment ,myOrders,allOrders,getOrdersAnalytics } = require("../controllers/orderController");

router.post("/checkout", authMiddleware, createOrder);
router.post("/payment-verify", authMiddleware, verifyPayment);
router.get("/my-orders", authMiddleware, myOrders);

// Route for admin to get all orders 
router.get("/all-orders", allOrders);
router.get("/analytics", getOrdersAnalytics);


module.exports = router;
