const express = require('express');
// const passport = require("passport");
const router = express.Router();
const UserController = require('../controllers/usercontroller');
const ShopController = require('../controllers/shopController');

//user
router.get('/', UserController.home)
router.get('/signup', UserController.renderSignup);
router.post('/signup', UserController.handleSignup);
router.get('/otp-page', UserController.verifyOtpPage);
router.get('/sendotp', UserController.sendOtp);
router.post('/verify-otp', UserController.verifyOtpPage)
router.get('/login', UserController.userLoginPage);
router.post('/login', UserController.userLogin);
router.get("/blocked", UserController.blockedPage);

router.get('/shop', ShopController.getShopPage);

module.exports = router;