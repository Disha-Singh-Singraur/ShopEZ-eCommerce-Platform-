const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discount: Number,
  category: String,
  gender: String,
  mainImg: String,
  sizes: [String],
  carousel: [String]
});

module.exports = mongoose.model("Product", productSchema);