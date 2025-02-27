const transporter = require('../services/otpSender');
const fs = require("fs");
const path = require("path");

let sendOtp = async (otp, email) => {
    try {
        await transporter.sendMail({
            from: process.env.OTP_EMAIL, // Use email from environment variables
            to: email,
            subject: 'Your OTP Code',
            text: `${otp}`,
        });
        console.log('OTP sent successfully!');
    } catch (err) {
        console.error('Failed to send OTP:', err.message);
        console.error('Error details:', err);
    }
};

module.exports=sendOtp;
