require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./src/middlewares/errorHandler");
const connectDB = require("./src/config/dbConfig");

// const reviewRoutes = require("./src/routes/reviewRoutes");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoute")



const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

// Connect to the database
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// User Routes
app.use("/api/users",userRoutes);

// Product Route
app.use("/api/product",productRoutes);

// Cart Route
app.use('/api/cart', require('./src/routes/cartRoutes'));
//Marks as Favourite Api
app.use('/api/favorites', require('./src/routes/favoriteRoutes'));


// Error handling middleware
app.use(errorHandler);

// Export the app for use in server.js
module.exports = app;

// Start the server if this file is executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

