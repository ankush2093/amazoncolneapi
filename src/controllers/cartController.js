// const Cart = require('../models/CartModel');

// // Get user's cart
// const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Add product to cart
// const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     let cart = await Cart.findOne({ user: req.user._id });

//     if (!cart) {
//       cart = new Cart({ user: req.user._id, products: [] });
//     }

//     const existingProduct = cart.products.find((item) => item.product.toString() === productId);

//     if (existingProduct) {
//       existingProduct.quantity += quantity || 1;
//     } else {
//       cart.products.push({ product: productId, quantity: quantity || 1 });
//     }

//     await cart.save();
//     res.status(200).json({ message: 'Product added to cart', cart });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// module.exports = {
//   getCart,
//   addToCart,
// };



const Cart = require('../models/CartModel');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
    }

    const existingProduct = cart.products.find((item) => item.product.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter((item) => item.product.toString() !== id);
    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Increase product quantity
const increaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const product = cart.products.find((item) => item.product.toString() === id);
    if (product) {
      product.quantity += 1;
      await cart.save();
      res.status(200).json({ message: 'Quantity increased', cart });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Decrease product quantity
const decreaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const product = cart.products.find((item) => item.product.toString() === id);
    if (product) {
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        cart.products = cart.products.filter((item) => item.product.toString() !== id);
      }
      await cart.save();
      res.status(200).json({ message: 'Quantity decreased', cart });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
};
