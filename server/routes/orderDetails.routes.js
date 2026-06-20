const express = require('express');
const router = express.Router();
const orderDetailsController = require('../controller/orderDetails.controller');

router.route('/')
  .post(orderDetailsController.createOrderDetails)       // Create new order details
  .get(orderDetailsController.getAllOrderDetails);        // Get all order details

router.route('/:id')
  .get(orderDetailsController.getOrderDetailsById)       // Get order details by ID
  .put(orderDetailsController.updateOrderDetailsById)    // Update order details by ID
  .delete(orderDetailsController.deleteOrderDetailsById); // Delete order details by ID

module.exports = router;


