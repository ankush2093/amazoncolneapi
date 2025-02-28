

const Cart = require('../models/CartModel');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    if (!cart) {
      return res.status(200).json({ products: [] }); // Return an empty cart instead of 404
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// const addToCart = async (req, res) => {
//   try {
//     let { productId, quantity } = req.body;
//     quantity = Math.max(1, quantity || 1);

//     const cart = await Cart.findOneAndUpdate(
//       { user: req.user._id, "products.product": productId },
//       { $inc: { "products.$.quantity": quantity } },
//       { new: true }
//     ).populate('products.product');

//     if (!cart) {
//       const newCart = new Cart({ user: req.user._id, products: [{ product: productId, quantity }] });
//       await newCart.save();
//       await newCart.populate('products.product');
//       return res.status(200).json({ message: 'Product added to cart', cart: newCart });
//     }

//     res.status(200).json({ message: 'Product added to cart', cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


// Remove product from cart

const addToCart = async (req, res) => {
  try {
    let { productId, quantity } = req.body;
    quantity = Math.max(1, quantity || 1);

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [{ product: productId, quantity }] });
    } else {
      let existingProduct = cart.products.find(item => item.product.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await cart.populate('products.product');

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};





const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const productIndex = cart.products.findIndex(item => item.product.toString() === id);
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found in cart' });

    cart.products.splice(productIndex, 1);
    await cart.save();
    await cart.populate('products.product');

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Increase product quantity
const increaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const product = cart.products.find(item => item.product.toString() === id);
    if (!product) return res.status(404).json({ message: 'Product not found in cart' });

    product.quantity += 1;
    await cart.save();
    await cart.populate('products.product');

    res.status(200).json({ message: 'Quantity increased', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Decrease product quantity
const decreaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const productIndex = cart.products.findIndex(item => item.product.toString() === id);
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found in cart' });

    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      cart.products.splice(productIndex, 1); // Remove product if quantity is 1
    }

    await cart.save();
    await cart.populate('products.product');

    res.status(200).json({ message: 'Quantity decreased', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Clear cart
const clearCart = async (req, res) => {
  try {
    await Cart.updateOne({ user: req.user._id }, { $set: { products: [] } });

    res.status(200).json({ message: 'Cart cleared', cart: { products: [] } });
  } catch (error) {
    console.error(error);
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
