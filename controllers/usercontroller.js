const bcrypt = require('bcrypt');
const passport = require('passport')
const User = require('../models/userModel');
const otpModel = require('../models/otpModel')
const otpSender = require('../helper/sendOtp')

exports.home = async(req, res)=> {
    try{
        res.render('users/index', { user: req.session.user || null });
    }catch(error){
        console.error("Error in rendering homepage ", error);
        res.status(500).send("Server Error");
    }
}
exports.renderSignup = async(req, res) => {
    const signError = req.session.signError || null;
    req.session.signError = null; // Clear error after displaying
    res.render('users/signup', { error: signError });
};

exports.handleSignup = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('users/signup', {
                error: "Email already exists. Try another email.",
                name, email, phone, password
            });
        }
        
        const otpData = new otpModel({
            name: name,
            email: email,
            phone: phone,
            password: password,
        })
        const data = await otpData.save();  
        req.session.otp = true;
        req.session.otpId = data._id
        return res.redirect(`/sendotp`);

    } catch (err) {
        console.error("Error during signup:", err);
        return res.redirect("/signup");
    }
};

exports.sendOtp = async (req,res)=>{
    try {
        const otpData = await otpModel.findOne({_id:req.session.otpId})
        const otp = Math.floor(100000 + Math.random() * 900000);
        await otpModel.updateOne({_id: req.session.otpId}, {otp: otp})
        await otpSender(otp,otpData.email);
        
        req.session.otpTime=60;
        req.session.otpStartTime = null
        res.redirect('/otp-page')
    } catch (error) {
        console.log(error);  
    }
}

exports.verifyOtpPage = async (req, res) => {
    const { otp } = req.body;
    const error='';

    if (!req.session.otpStartTime) {
        req.session.otpStartTime = Date.now();
    }
    
    const elapsedTime = Math.floor((Date.now() - req.session.otpStartTime) / 1000);
    let time = Math.max(req.session.otpTime - elapsedTime, 0);
    time = Number(time)

    try {
        const otpData = await otpModel.findOne({ _id: req.session.otpId });

        if (elapsedTime > req.session.otpTime) {
            error = "OTP has expired.";
            return res.render("users/otp", { error, time});
        }

        if (otpData.otp !== Number(otp)) {
            error = "Invalid OTP. Please try again.";
            return res.render("users/otp", { error, time });
        }
        return res.redirect('/');
    } catch (error) {
        
    }
    res.render('users/otp', { error, time });
};

 exports.userLoginPage = async (req, res) => {
    try {
        if (req.session.isLogged || req.session.signedIn) {
            return res.redirect('/');
        }
        const err = req.session.loginError || null;
        req.session.loginError = null; 
        res.render('users/login', { err }); 
    } catch (error){
        console.error("Unexpected error in login page rendering:", error);
        res.status(500).send("Server Error");
    }
};

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            req.session.loginError = "Please enter both email and password.";
            return res.redirect('/login');
        }
        const loginData = await User.findOne({ email });
        if (!loginData) {
            req.session.loginError = "Invalid email or password.";
            return res.redirect('/login');
        }
        const isPasswordValid = await bcrypt.compare(password, loginData.password);
        if (!isPasswordValid) {
            req.session.loginError = "Invalid email or password.";
            return res.redirect('/login');
        }
        req.session.user = {
            id: loginData._id,
            email: loginData.email,
        };
        req.session.isLogged = true;
        return res.redirect('/');

    } catch (error) {
        console.error("Login error:", error);
        req.session.loginError = "Something went wrong. Please try again.";
        res.redirect('/login');
    }
};


exports.googleAuthCallback = passport.authenticate("google", {
    successRedirect: "/index",
    failureRedirect: "/login",
  });
  
exports.blockedPage = async (req, res) => {
    res.render("blockedUser");
};


// exports.resetPassword = async (req, res)=> {

// }


