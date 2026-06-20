const express = require('express');
const router = express.Router();
const saleTypeController = require('../controller/saleType.controller');

// Create a new sale type
router.route('/sync')
    .get(saleTypeController.syncSaleTypeData);

router.route('/')
    .post(saleTypeController.addSaleType)
    .get(saleTypeController.getAllSaleTypes);

// Add multiple sale types
router.route('/add-all')
    .post(saleTypeController.addAllSaleTypes);

// Get active sale types only
router.route('/active')
    .get(saleTypeController.getActiveSaleTypes);

// Get sale type by code
router.route('/code/:code')
    .get(saleTypeController.getSaleTypeByCode);

// Get some sale types
router.route('/some')
    .get(saleTypeController.getSomeSaleTypes);

// Debug sale types
router.route('/debug')
    .get(saleTypeController.debugSaleTypes);

// Update multiple sale types
router.route('/update-many')
    .put(saleTypeController.updateManySaleTypes);

// Delete multiple sale types
router.route('/delete-many')
    .delete(saleTypeController.deleteManySaleTypes);

// Individual sale type operations
router.route('/:id')
    .get(saleTypeController.getSaleTypeById)
    .put(saleTypeController.updateSaleType)
    .delete(saleTypeController.deleteSaleType);

// Update status
router.route('/:id/status')
    .put(saleTypeController.updateStatus);

module.exports = router; 