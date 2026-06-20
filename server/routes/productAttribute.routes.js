const express = require('express');
const router = express.Router();
const productAttributeController = require('../controller/productAttribute.controller');

router.route('/product-attributes')
  .post(productAttributeController.createProductAttribute)       // Create a new product attribute
  .get(productAttributeController.getAllProductAttributes);      // Get all product attributes

router.route('/product-attributes/:id')
  .get(productAttributeController.getProductAttributeById)       // Get a product attribute by ID
  .put(productAttributeController.updateProductAttributeById)    // Update a product attribute by ID
  .delete(productAttributeController.deleteProductAttributeById); // Delete a product attribute by ID


module.exports = router;

