const User = require("../model/userModel");

module.exports = async (req, res, next) =>{
    try {
        if(!(req.session.loginSession || req.session.signupSession)){
            return res.redirect("/login");
        }
        const userEmail = req.session.user && req.session.user.email;
        if(!userEmail){
            req.session.destroy();
            return res.redirect("/login");
        }
        const user = await User.findOne({ email: userEmail });
        if(!user){
            req.session.destroy();
            return res.redirect("/login");
        }
        if(!user.isActive){
            return res.redirect("/blocked");
        }
        next();
    }catch (err){
        console.error("Authentication Middleware Error:", err);
        res.status(500).send("Server Error");
    }
};
