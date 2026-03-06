const express = require("express");
const router = express.Router();

const { placeOrder, getOrders, getSingleOrder } = require("../controllers/orderController");

router.post("/place", placeOrder);
router.get("/", getOrders);
router.get("/:orderId", getSingleOrder);

module.exports = router;