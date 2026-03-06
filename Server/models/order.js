const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User"
    },

    address: String,
    pincode: String,

    paymentMethod: String,

    orderDate: {
        type: Date,
        default: Date.now
    },

    deliveryDate: Date,

    items: [
        {
            productId: {
                type: ObjectId,
                ref: "Product"
            },
            quantity: Number,
            size: String,
            price: Number
        }
    ]
});

module.exports = mongoose.model("Order", orderSchema);