const express = require("express");
const router = express.Router();
const { addToCart, getCartItems, removeFromCart, updateCartItem } = require("../controllers/cartController");

router.get("/", getCartItems);
router.post("/add", addToCart);
router.delete("/:cartItemId", removeFromCart);
router.put("/:cartItemId", updateCartItem); 

module.exports = router;