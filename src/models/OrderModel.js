const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cart: [
      {
        ProductId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false }, // Made optional
        quantity: { type: Number, required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
