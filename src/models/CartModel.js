const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      thumbnail: { type: String, required: true },
      quantity: { type: Number, required: true },
      description: { type: String },
      storeName: { type: String },
    },
  ],
});

module.exports = mongoose.model('Cart', CartSchema);


// const mongoose = require("mongoose");

// const CartSchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   items: [
//     {
//       id: { type: Number, required: true },
//       title: String,
//       price: Number,
//       thumbnail: String,
//       quantity: { type: Number, default: 1 },
//       description: String,
//       storeName: String,
//     },
//   ],
//   favorites: [
//     {
//       id: { type: Number, required: true },
//       title: String,
//       price: Number,
//       thumbnail: String,
//       description: String,
//     },
//   ],
// });

// const Cart = mongoose.model("Cart", CartSchema);
// module.exports = Cart;
