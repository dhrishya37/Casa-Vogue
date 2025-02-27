const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { 
        type: String, 
        default: "/images/profile.webp" 
    },
    isBlocked: { type: Boolean, default: false }, // Admin controls user access
    resetToken: { type: String },  
    tokenExpiry: { type: Date }    
}, { timestamps: true }); // adds createdAt and updatedAt

const userCollection = mongoose.model("User", userSchema)

module.exports = userCollection;