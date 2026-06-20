const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');

router.route('/')
  .post(categoryController.createCategory)       // Create a new category
  .get(categoryController.getAllCategories)      // Get all categories
  .delete(categoryController.deleteAllCategories);


router.route('/refresh')
  .get(categoryController.syncBusyCategories); // Get busy category refresh data
router.route('/sync')
  .post(categoryController.syncBusyCategories); // Sync categories from Busy API
router.route('/active')
  .get(categoryController.activeCategories)        // Get a category by ID

router.route('/:id')
  .get(categoryController.getCategoryById)        // Get a category by ID
  .put(categoryController.updateCategoryById)     // Update a category by ID
  .delete(categoryController.deleteCategoryById);  // Delete a category by ID

router.route('/stru')
  .get(categoryController.getAllCategories)        // Get a category by ID


module.exports = router;


