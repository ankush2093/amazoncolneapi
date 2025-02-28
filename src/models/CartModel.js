// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', 
//     required: true
//   },
//   products: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product', 
//         required: true
//       },
//       quantity: {
//         type: Number,
//         default: 1,
//         min: 1
//       }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// });

// const Cart = mongoose.model('Cart', cartSchema);
// module.exports = Cart;



const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
