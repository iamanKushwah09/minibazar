const express = require('express');
const router = express.Router();
const shippingController = require('../../controller/client/shipping.controller');

router.post('/calculate', shippingController.calculateShipping);

module.exports = router;
