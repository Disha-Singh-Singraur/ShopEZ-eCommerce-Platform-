const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

const getStats = async (req, res) => {
  try {
    const [usersCount, productsCount, ordersCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments()
    ]);

    res.json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

module.exports = { getStats };
