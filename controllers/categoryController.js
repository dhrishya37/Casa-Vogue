const Category = require('../models/categoryModel');

const getAllCategories = async (req, res) =>{
    try {
        const categories = await Category.find();
        res.render("admin/categories", { categories }); 
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

const addCategory = async (req, res) =>{
    try {
        const { categoryName, isListed } = req.body;
        const formattedCategoryName = categoryName.trim().toLowerCase().replace(/\s+/g, " "); 
        const existingCategory = await Category.findOne({ categoryName: { $regex: `^${formattedCategoryName}$`, $options: "i" } });

        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists!" });
        }
        const newCategory = new Category({
            categoryName: formattedCategoryName,
            isListed: isListed !== undefined ? isListed : true
        });

        await newCategory.save();
        res.status(201).json({ message: "Category added successfully", newCategory });
    } catch (error) {
        res.status(500).render("error", { message: "Error adding category", error });
    }
};

const deleteCategory = async (req, res) =>{
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.send(200).json({ok:true})
    } catch (error) {
        console.log(error);
        res.status(500).render("error", { message: "Error deleting category", error });
    }
};

const updateCategory = async(req, res) =>{
    try {
        const _id = req.params.id;
        const { categoryName, isListed } = req.body;
        await Category.findByIdAndUpdate({_id}, { categoryName, isListed }, { new: true });
        return res.json({ok:true})
    } catch (error) {
        console.log("Update Error:", error);
        return res.status(500).json("error", { message: "Error updating category", error });
    }
};

module.exports = { getAllCategories, addCategory, deleteCategory, updateCategory };