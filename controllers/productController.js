const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

const productPage = async (req, res)=>{
    try {
        const products = await Product.find({}).populate({
            path:"category_id",select:"categoryName _id"
        })
        res.render('admin/product', { products });  
    } catch (error) {
        console.error("Error in fetching products ", error);
        res.status(500).send("Server Error");
    }
}

const showAddProduct = async(req, res)=>{
    const categories = await Category.find({})
    res.render('admin/add-product',{categories});
};

const addProduct = async(req, res) =>{
    try{
        const { productName, productCategory, productMaterial, productStyle, price, description, isListed} = req.body;
        const images = req.files ? req.files.map(file => file.filename) : [];
        console.log("Request Body:", req.body);
        console.log("Uploaded Files:", req.files);

        const newProduct = new Product({ productName, category_id: productCategory, productMaterial, productStyle, price, description, isListed: isListed === 'true', images });
        await newProduct.save(); 
        res.redirect("/products"); 
    } catch (error){
        console.error("Error adding product:", error);
        res.status(500).send("Server Error");
    }
};

// const getCategories = async (req, res) => {
//     try{
//         const categories = await Category.find();
//         console.log(categories)
//         return res.json(categories);
//     }catch (error){
//         console.error("Error fetching categories:", error);
//         res.status(500).json({ error: "Failed to fetch categories" });
//     }
// };

module.exports = { productPage, showAddProduct, addProduct}; // , getCategories 