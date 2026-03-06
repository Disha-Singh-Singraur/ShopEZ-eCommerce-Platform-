const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    userType: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

module.exports = mongoose.model("User", userSchema);