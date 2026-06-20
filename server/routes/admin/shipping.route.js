const express = require('express');
const router = express.Router();
const shippingController = require('../../controller/admin/shipping.controller');

// Settings
router.get('/settings', shippingController.getShippingSettings);
router.put('/settings', shippingController.updateShippingSettings);

// Pharmacy Settings
router.get('/pharmacy/settings', shippingController.getPharmacySettings);
router.put('/pharmacy/settings', shippingController.updatePharmacySettings);

// Shipping Rules
router.post('/shipping-rules', shippingController.createShippingRule);
router.get('/shipping-rules', shippingController.getShippingRules);
router.get('/shipping-rules/:id', shippingController.getShippingRuleById);
router.put('/shipping-rules/:id', shippingController.updateShippingRule);
router.delete('/shipping-rules/:id', shippingController.deleteShippingRule);

module.exports = router;
