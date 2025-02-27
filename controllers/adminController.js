const User = require('../models/userModel');
require('dotenv').config();

const adminPage = (req, res) => {
    if (req.session.admin) {
        res.redirect('/home');
    } else {
        res.render('admin/adminLogin', { message: null });  
    }
};

const adminLogin = async (req, res) =>{
    const adminEmail = process.env.EMAIL;
    const adminPassword = process.env.PASSWORD;
    const { email, password } = req.body;
    if (email === adminEmail && password === adminPassword){
        req.session.admin = true;
        res.redirect('/home');
    } else {
        return res.redirect("/admin")
    }
};

const adminHome = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/admin');
        } else {
            return res.render("admin/home")
        }    
    } catch (error) {
        console.error("Error fetching home page:", error);
        res.render('admin/home', { navItems: [] }); 
    }
};

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = 5;
        const searchQuery = req.query.search || "";

        const filter = searchQuery? { name: new RegExp(searchQuery, "i")} : {};
        const totalUsers = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / limit);

        const allUsers = await User.find(filter).skip((page - 1) * limit).limit(limit);

        const user = "Dhirishya";
        const message = "Hello";

        res.render("admin/customer", {
            user,
            allUsers,
            message,
            page,
            totalPages,
            searchQuery,
        });
    }catch (error) {
        res.status(500).send("Error rendering page");
    }
    
};
const searchUsers = async (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin');
    }
    const { query } = req.query;
    let searchPerformed = false;

    if (!query) {
        const allUsers = await User.find({}, 'name email phone isBlocked');
        return res.render('admin/home', { 
            allUsers, 
            totalUsers: await User.countDocuments(),
            blockedUsers: await User.countDocuments({ isBlocked: true }),
            message: "Please enter a search term.", 
            searchPerformed 
        }); 
    }
    try {
        const allUsers = await User.find({
            $or: [
                { name: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') },
                { phone: new RegExp(query, 'i') }
            ]
        }, 'name email phone isBlocked');
        searchPerformed = true;

        if (allUsers.length === 0) {
            return res.render('admin/home', { 
                allUsers, 
                totalUsers: await User.countDocuments(),
                blockedUsers: await User.countDocuments({ isBlocked: true }),
                message: "No users found matching your search.", 
                searchPerformed 
            });
        }
        res.render('admin/home', { 
            allUsers, 
            totalUsers: await User.countDocuments(),
            blockedUsers: await User.countDocuments({ isBlocked: true }),
            message: null, 
            searchPerformed 
        });
    } catch (error){
        console.error("Error during search:", error);
        res.render('admin/home', { 
            allUsers: [], 
            totalUsers: 0, 
            blockedUsers: 0, 
            message: "An error occurred while searching. Please try again.", 
            searchPerformed 
        });
    }
};

const blockUser = async (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { isBlocked: true });
        res.status(200).json({ message: "User blocked successfully" });
    }catch (error){
        console.error("Error blocking user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const unblockUser = async (req, res) => {
    if (!req.session.admin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { isBlocked: false });
        res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const adminLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
};

module.exports = {
    adminPage,
    adminLogin,
    adminHome,
    getUsers,
    searchUsers,
    blockUser,
    unblockUser,
    adminLogout
};
