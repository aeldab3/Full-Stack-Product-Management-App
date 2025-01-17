const mongoose = require("mongoose");
const userRole = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    phones: {type: Array, required: true, unique: true},
    role: {type: String, enum: [userRole.MANAGER, userRole.ADMIN, userRole.USER], default: userRole.USER},
    token: {type: String}
})

module.exports = mongoose.model("User", userSchema);