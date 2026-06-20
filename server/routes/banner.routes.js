const express = require('express');
const router = express.Router();
const bannerController = require('../controller/banner.controller');

router.route('/')
    .post(bannerController.createBanner)
    .get(bannerController.getAllBanners);

router.route('/:id')
    .get(bannerController.getBannerById)
    .put(bannerController.updateBannerById)
    .delete(bannerController.deleteBannerById);

module.exports = router;


