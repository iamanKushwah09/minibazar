const express = require('express');
const router = express.Router();
const vendorSalesmanController = require('../controller/vendorSalesmanController');

// Route to get vendor-salesman association report
router.get('/report', vendorSalesmanController.getVendorSalesmanReport);

module.exports = router;