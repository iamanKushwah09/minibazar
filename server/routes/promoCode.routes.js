const express = require('express');
const router = express.Router();
const promoCodeController = require('../controller/promoCode.controller');

router.route('/')
    .post(promoCodeController.createPromoCode)
    .get(promoCodeController.getAllPromoCodes);

router.route('/:id')
    .get(promoCodeController.getPromoCodeById)
    .put(promoCodeController.updatePromoCodeById)
    .delete(promoCodeController.deletePromoCodeById);

module.exports = router;
