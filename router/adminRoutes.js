const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const ProductController = require('../controllers/productController');
const CategoryController = require('../controllers/categoryController');
const upload = require('../services/multerServices');

router.get('/admin', adminController.adminPage);
router.post('/admin', adminController.adminLogin);
router.get('/home', adminController.adminHome);
router.get('/search', adminController.searchUsers);
router.put('/block/:id', adminController.blockUser);
router.put('/unblock/:id', adminController.unblockUser);

router.get('/customer', adminController.getUsers);

router.get('/products', ProductController.productPage)
router.get('/add-product', ProductController.showAddProduct);
router.post("/add-product", upload.array("images", 4), ProductController.addProduct);


router.get('/categories', CategoryController.getAllCategories); 
router.post('/admin/categories/add', CategoryController.addCategory);
router.delete('/admin/categories/delete/:id', CategoryController.deleteCategory); 
router.put('/admin/categories/edit/:id', CategoryController.updateCategory); 

module.exports = router; 