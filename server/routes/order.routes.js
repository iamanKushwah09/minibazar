const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');

router.route('/')
  .post(orderController.createOrder)       // Create a new order
  .get(orderController.getAllOrders);      // Get all orders

router.route('/:id')
  .get(orderController.getOrderById)       // Get an order by ID
  .put(orderController.updateOrderById)    // Update an order by ID
  .delete(orderController.deleteOrderById); // Delete an order by ID

module.exports = router;


