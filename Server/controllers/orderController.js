const Order = require("../models/order");
const Cart = require("../models/cart");

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { address, pincode, paymentMethod } = req.body;
        const cartItems = await Cart.find({ userId }).populate("productId");

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const order = new Order({
            userId,
            address,
            pincode,
            paymentMethod,
            deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            items: cartItems.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
                size: item.size,
                price: item.productId.price || 0
            }))
        });

        await order.save();
        await Cart.deleteMany({ userId });

        res.json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error("Order API Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId }).populate("items.productId");
        res.json(orders);
    } catch (error) {
        console.error("Order API Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("items.productId").populate("userId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("Order API Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { placeOrder, getOrders, getSingleOrder };
