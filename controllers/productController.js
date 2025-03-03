const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const path = require("path");
const fs = require("fs");

const productPage = async (req, res) => {
  try {
    const categories = await Category.find({}, "categoryName _id"); 
    const products = await Product.find({}).populate({ path: "category_id", select: "categoryName _id" }); 

    res.render("admin/product", { products, categories }); 
  } catch (error) {
    console.error("Error in fetching products and categories:", error);
    res.status(500).send("Server Error");
  }
};

const showAddProduct = async (req, res) => {
  const categories = await Category.find({});
  res.render("admin/add-product", { categories });
};

const addProduct = async (req, res) => {
  try {    
    const { productName, category_id, productMaterial, description, productStyle, price, isListed } = req.body;    
    const images = req.files.map((file) => `/uploads/${file.filename}`);    
    const newProduct = new Product({
      productName,
      category_id,
      productMaterial,
      description,
      productStyle,
      price,
      isListed,
      images,
    });
       
    await newProduct.save();
    res.status(200).json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
      const { productId } = req.params;
      const Products = await Product.findById(productId);

      if (Products.images.length > 0) {
        Products.images.forEach((imagePath) => {
          const fullPath = path.join(__dirname, "../public", imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
  
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
      res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    const categories = await Category.find(); 

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("admin/edit-product", { product, categories });
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateProduct = async (req, res) => {
  try {
      const {id}= req.params;
      const { productName, category_id, productMaterial, description, productStyle, price, isListed } = req.body;
      let updateFields = { productName, category_id, productMaterial, description, productStyle, price, isListed };
      console.log(updateFields)
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => `/uploads/${file.filename}`);
        updateFields.images = newImages;
  
        const product = await Product.findById(id);
        console.log(product)
        if (product && product.images && product.images.length > 0) {
          product.images.forEach((imagePath) => {
            const fullPath = path.join(__dirname, "../public", imagePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          });
        }
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      return res.json({ success: true, message: "Product updated successfully", updatedProduct });
    } catch (error) {
      console.error("Update Error:", error);
      return res.status(500).json({ success: false, message: "Error updating product", error });
    }
  };

module.exports = { productPage, showAddProduct, addProduct, deleteProduct, getEditProduct, updateProduct }; 
