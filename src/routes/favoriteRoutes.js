const express = require("express");
const { toggleFavorite } = require("../controllers/favoriteController");
const router = express.Router();

router.post("/favorite", toggleFavorite);

module.exports = router;