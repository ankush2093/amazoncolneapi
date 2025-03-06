const Favorite = require("../models/FavoriteModel");

// Toggle favorite item
const toggleFavorite = async (req, res) => {
  const { userId, item } = req.body;
  try {
    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      favorite = new Favorite({ userId, items: [item] });
    } else {
      const existingItem = favorite.items.find((i) => i.productId === item.productId);
      if (existingItem) {
        favorite.items = favorite.items.filter((i) => i.productId !== item.productId);
      } else {
        favorite.items.push(item);
      }
    }

    await favorite.save();
    res.status(200).json(favorite);
  } catch (error) {
    res.status(500).json({ message: "Error toggling favorite", error });
  }
};

module.exports = { toggleFavorite };