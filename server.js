const express = require("express");
const connectDB = require("./src/config/dbConfig");
const app = express();

require("dotenv").config();

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

