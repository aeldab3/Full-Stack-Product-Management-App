const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    imageUrl: {type: String},
    catId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'category'},
});

module.exports = mongoose.model("Product", productSchema);