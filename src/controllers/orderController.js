const crypto = require("crypto");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const OrderModel = require("../models/OrderModel");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, cart, address } = req.body;
    const userId = req.user?.id;
    // console.log("Received Amount:", amount);
    // console.log("Received Cart:", cart);
    // console.log("Received Address:", address);

    if (!amount || !cart || cart.length === 0 || !address) {
      return res.status(400).json({ success: false, message: "Amount, cart, and address are required" });
    }

    let existingOrder = await OrderModel.findOne({ user: userId, status: "Pending" });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "You already have a pending order. Please complete the payment.",
        orderId: existingOrder.razorpayOrderId,
        amount: existingOrder.totalAmount * 100,
      });
    }

    const order = await razorpay.orders.create({
      amount: amount, // Ensure this is in paisa
      currency: "INR",
      receipt: `receipt#${Date.now()}`,
    });

    if (!order) {
      return res.status(500).json({ success: false, message: "Failed to create order with Razorpay" });
    }

    const newOrder = new OrderModel({
      user: userId,
      cart,
      totalAmount: amount / 100, // Ensure it's stored in ₹ and not paisa
      razorpayOrderId: order.id,
      status: "Pending",
      address,
    });

    await newOrder.save();
    console.log("Saved Order:", newOrder);

    res.json({ success: true, amount: order.amount, orderId: order.id });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Just for verifying payment details Status Prnding OR Confermed
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment details." });
    }

    const order = await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      
      await OrderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" }
      );

      return res.status(400).json({ success: false, message: "Payment verification failed. Try again." });
    }

    // Update Order Status in DB 
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: "Paid", razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Payment verified & order updated successfully!",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// for user
exports.myOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    const orders = await OrderModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("createdAt cart totalAmount razorpayOrderId status address");

    const formattedOrders = orders.map((order) => ({
      date: order.createdAt,
      order_id: order.razorpayOrderId,
      order_status: order.status,
      quantity: order.cart.reduce((total, item) => total + item.quantity, 0),
      price: order.totalAmount,
      products: order.cart.map((item) => ({
        product_id: item._id?.toString() || "Unknown ID", // Use _id from cart
        title: item.title || "Unknown Title",
        image: item.image || "https://via.placeholder.com/150",
        quantity: item.quantity,
      })),
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("My Orders Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// for admin
exports.allOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "cart.ProductId",
        select: "image title",
      })
      .populate({
        path: "user",
        select: "email name", // Fetch user details
      })
      .select("createdAt cart totalAmount razorpayOrderId status address user");

    const formattedOrders = orders.map((order) => ({
      date: order.createdAt,
      order_id: order.razorpayOrderId,
      order_status: order.status,
      user: {
        user_id: order.user?._id,
        name: order.user?.name,
        email: order.user?.email,
      },
      quantity: order.cart.reduce((total, item) => total + item.quantity, 0),
      price: order.totalAmount,
      products: order.cart.map((item) => ({
        product_id: item.ProductId?._id,
        title: item.ProductId?.title || item.title, // Fallback in case of missing ProductId
        image: item.ProductId?.image || item.image,
        quantity: item.quantity,
      })),
      address: order.address, // Include full address details
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("All Orders Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// for dash board
exports.getOrdersAnalytics = async (req, res) => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Order Analytics Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

