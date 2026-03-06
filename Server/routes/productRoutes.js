const express = require("express");
const router = express.Router();
const { getProducts, getSingleProduct, createProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getProducts);
router.post("/", authMiddleware, adminMiddleware, createProduct);

router.get("/:id", getSingleProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;