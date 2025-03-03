const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

const getShopPage = async (req, res) => {
    try {
        let { page, category, minPrice, maxPrice } = req.query;

        page = parseInt(page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;
        const filter = { isListed: true };

        if (category) {
            filter.category_id = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find(filter)
            .populate('category_id', 'categoryName')
            .skip(skip)
            .limit(limit);

        const categories = await Category.find({}, 'categoryName');

        res.render('users/shop', {
            products,
            categories,
            totalProducts,
            currentPage: 1, 
            totalPages: Math.ceil(totalProducts / 6),
            user: req.session.user || null
        });
    } catch (error) {
        console.error("Error fetching shop page:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getShopPage }
