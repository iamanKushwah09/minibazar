const express = require('express');
const router = express.Router();
const brandController = require('../controller/brand.controller');

router.route('/')
  .post(brandController.createBrand)         // Create a new brand
  .get(brandController.getAllBrands)        // Get all brands
  .delete(brandController.deleteAllbrands)

router.route('/active')
  .get(brandController.activeBrands)         // Get a brand by ID

router.route('/:id')
  .get(brandController.getBrandById)         // Get a brand by ID
  .put(brandController.updateBrandById)      // Update a brand by ID
  .delete(brandController.deleteBrandById);  // Delete a brand by ID

// Sync brands
router.post('/sync', brandController.syncBrand);

module.exports = router;

