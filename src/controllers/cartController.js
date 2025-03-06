const Cart = require('../models/CartModel');
const Favorite = require('../models/FavoriteModel');

// exports.getCart = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const cart = await Cart.findOne({ userId });
//     const favorites = await Favorite.findOne({ userId });

//     res.json({
//       items: cart ? cart.items : [],
//       favorites: favorites ? favorites.items : [],
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getCart = async (req, res) => {
  try {
    console.log("getCart called");
    const userId = req.params.userId;
    console.log("userId:", userId);
    const cart = await Cart.findOne({ userId });
    console.log("cart:", cart);
    const favorites = await Favorite.findOne({ userId });
    console.log("favorites:", favorites);

    res.json({
      items: cart ? cart.items : [],
      favorites: favorites ? favorites.items : [],
    });
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ message: error.message });
  }
};

// exports.addToCart = async (req, res) => {
//   try {
//     const { userId, item } = req.body;
//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = new Cart({ userId, items: [item] });
//     } else {
//       const existingItem = cart.items.find((cartItem) => cartItem.id === item.id);
//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         cart.items.push(item);
//       }
//     }
//     await cart.save();
//     res.json({ message: 'Item added to cart' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// In your cart.controller.js
exports.addToCart = async (req, res) => {
  try {
    console.log("addToCart called");
    console.log("Request body:", req.body); // Log the entire request body
    const { userId, item } = req.body;
    console.log("userId:", userId);
    console.log("item:", item);

    let cart = await Cart.findOne({ userId });
    console.log("Cart found:", cart); // Log the cart document

    if (!cart) {
      console.log("Cart not found, creating new cart");
      cart = new Cart({ userId, items: [item] });
    } else {
      console.log("Cart found, updating cart");
      const existingItem = cart.items.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        console.log("Item exists, increasing quantity");
        existingItem.quantity += 1;
      } else {
        console.log("Item does not exist, adding to cart");
        cart.items.push(item);
      }
    }
    console.log("Cart before save:", cart); // Log the cart before saving
    await cart.save();
    console.log("Cart saved successfully");
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error("Error in addToCart:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
};

// exports.addToCart = async (req, res) => {
//   try {
//     console.log("addToCart called");
//     const { userId, item } = req.body;
//     console.log("userId:", userId, "item:", item); // Check the received data

//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = new Cart({ userId, items: [item] });
//     } else {
//       const existingItem = cart.items.find((cartItem) => cartItem.id === item.id);
//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         cart.items.push(item);
//       }
//     }
//     await cart.save();
//     res.json({ message: 'Item added to cart' });
//   } catch (error) {
//     console.error("Error in addToCart:", error); // Log the error
//     res.status(500).json({ message: error.message });
//   }
// };


exports.removeFromCart = async (req, res) => {
  try {
    console.log("remove to cart called");
    console.log("Request body:", req.body); // Log the entire request body
    const { userId, itemId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = cart.items.filter((item) => item.id !== itemId);
      await cart.save();
      res.json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    console.log("update quantity called");
    console.log("Request body:", req.body); // Log the entire request body
    const { userId, itemId, type } = req.body;
    const cart = await Cart.findOne({ userId });

    if (cart) {
      const item = cart.items.find((item) => item.id === itemId);
      if (item) {
        if (type === 'increase') {
          item.quantity += 1;
        } else if (type === 'decrease' && item.quantity > 1) {
          item.quantity -= 1;
        } else if (type === "decrease" && item.quantity <= 1){
          cart.items = cart.items.filter((item) => item.id !== itemId);
        }
        await cart.save();
        res.json({ message: 'Quantity updated' });
      } else {
        res.status(404).json({ message: 'Item not found in cart' });
      }
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { userId, item } = req.body;
    let favorites = await Favorite.findOne({ userId });

    if (!favorites) {
      favorites = new Favorite({ userId, items: [item] });
    } else {
      const existingItem = favorites.items.find((fav) => fav.id === item.id);
      if (existingItem) {
        favorites.items = favorites.items.filter((fav) => fav.id !== item.id);
      } else {
        favorites.items.push(item);
      }
    }
    await favorites.save();
    res.json({ message: 'Favorite toggled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.syncCart = async (req, res) => {
  try {
    console.log("sync cart called");
    console.log("Request body:", req.body); 
    const { userId, cart, favorites } = req.body;

    await Cart.findOneAndUpdate({ userId }, { items: cart }, { upsert: true });
    await Favorite.findOneAndUpdate({ userId }, { items: favorites }, { upsert: true });

    res.json({ message: "Cart and favorites synced" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};