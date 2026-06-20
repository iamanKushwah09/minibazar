const express = require('express');
const router = express.Router();
const shippingController = require('../controller/shipping.controller');

router.route('/')
    .post(shippingController.createShipping)
    .get(shippingController.getAllShippings);

router.route('/:id')
    .get(shippingController.getShippingById)
    .put(shippingController.updateShippingById)
    .delete(shippingController.deleteShippingById);

module.exports = router;

