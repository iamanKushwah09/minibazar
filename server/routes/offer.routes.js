const express = require('express');
const router = express.Router();
const offerController = require('../controller/offer.controller');

router.route('/')
  .post(offerController.createOffer)        // Create a new offer
  .get(offerController.getAllOffers);       // Get all offers

router.route('/:id')
  .get(offerController.getOfferById)        // Get an offer by ID
  .put(offerController.updateOfferById)     // Update an offer by ID
  .delete(offerController.deleteOfferById);  // Delete an offer by ID

module.exports = router;

