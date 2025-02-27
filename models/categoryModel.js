const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    // productCount: { type: Number, default: 0 },
    isListed: { type: Boolean, default: true } 
}, {timestamps: true });

const categoryCollection = mongoose.model("Category", categorySchema);
module.exports = categoryCollection;
