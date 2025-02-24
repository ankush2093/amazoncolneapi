const Favorite = require('../models/FavoriteModel');

// Get user's favorite products
const getFavorites = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user._id }).populate('products');
    if (!favorite) {
      return res.status(404).json({ message: 'No favorite products found' });
    }
    res.json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add product to favorites
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;

    let favorite = await Favorite.findOne({ user: req.user._id });

    if (!favorite) {
      favorite = new Favorite({ user: req.user._id, products: [] });
    }

    if (!favorite.products.includes(productId)) {
      favorite.products.push(productId);
    }

    await favorite.save();
    res.status(200).json({ message: 'Product added to favorites', favorite });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Remove product from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    let favorite = await Favorite.findOne({ user: req.user._id });

    if (!favorite) return res.status(404).json({ message: 'No favorite products found' });

    favorite.products = favorite.products.filter((product) => product.toString() !== id);
    await favorite.save();
    res.status(200).json({ message: 'Product removed from favorites', favorite });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Clear all favorite products
const clearFavorites = async (req, res) => {
  try {
    let favorite = await Favorite.findOne({ user: req.user._id });
    if (!favorite) return res.status(404).json({ message: 'No favorite products found' });

    favorite.products = [];
    await favorite.save();
    res.status(200).json({ message: 'All favorite products removed', favorite });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
};
