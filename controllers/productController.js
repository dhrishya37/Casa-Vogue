const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const path = require("path");
const fs = require("fs");

const productPage = async (req, res) => {
  try {
    const products = await Product.find({}).populate({
      path: "category_id",
      select: "categoryName _id",
    });
    res.render("admin/product", { products });
  } catch (error) {
    console.error("Error in fetching products ", error);
    res.status(500).send("Server Error");
  }
};

const showAddProduct = async (req, res) => {
  const categories = await Category.find({});
  res.render("admin/add-product", { categories });
};

const addProduct = async (req, res) => {
  try {
    const { productName, productCategory, productMaterial, description, productStyle, price, isListed } = req.body;    
    const images = req.files.map((file) => `/uploads/${file.filename}`);    
    const newProduct = new Product({
      productName,
      category_id: productCategory,
      productMaterial,
      description,
      productStyle,
      price,
      isListed,
      images, // Save image paths in MongoDB
    });    
    await newProduct.save();
    res.redirect("/products");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { productPage, showAddProduct, addProduct }; 
