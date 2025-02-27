const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true},
  password: { type: String, required: true},
  otp: { type: Number },
  otpExpires:{type: Number},
}, { timestamps: true });
//index, ttl :2hr
const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;