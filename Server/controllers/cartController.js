const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

const addToCart = async (req, res) => {
  try {
    console.log("Add to cart received:", req.body);

    const userId = req.user.id; // from JWT
    const { productId, size, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingItem = await Cart.findOne({
      userId,
      productId,
      size
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();

      return res.json({
        message: "Item quantity updated successfully",
        cartItem: existingItem
      });
    }

    const cartItem = new Cart({
      userId,
      productId,
      size,
      quantity
    });

    await cartItem.save();

    res.json({
      message: "Item added to cart successfully",
      cartItem
    });

  } catch (error) {
    console.error("Cart API Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.find({ userId }).populate("productId");

    res.json(cartItems);
  } catch (error) {
    console.error("Cart API Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await Cart.findByIdAndDelete(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Cart API Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      message: "Item quantity updated successfully",
      cartItem
    });
  } catch (error) {
    console.error("Cart API Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { addToCart, getCartItems, removeFromCart, updateCartItem };
