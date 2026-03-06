const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized. Please login." });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Server error checking admin status." });
  }
};

module.exports = adminMiddleware;
