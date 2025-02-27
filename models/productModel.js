const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    images: [{ type: String }],
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    productMaterial: { type: String, required: true },
    description: { type: String, required: true },
    productStyle: { type: String, required: true },
    price: { type: Number, required: true },
    isListed: { type: Boolean, default: true } 
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const productCollection = mongoose.model("Product", productSchema);

module.exports = productCollection;
