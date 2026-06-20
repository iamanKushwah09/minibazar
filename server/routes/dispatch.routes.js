const express = require('express');
const router = express.Router();
const dispatchController = require('../controller/dispatch.controller');

router.route('/')
  .post(dispatchController.createDispatch)       // Create a new order
  .get(dispatchController.getDispatch);      // Get all orders

router.route('/:id')
  .get(dispatchController.getDispatchById)       // Get an order by ID
  .put(dispatchController.updateDispatchById)    // Update an order by ID
  .delete(dispatchController.deleteDispatchById); // Delete an order by ID

  router.route('/items/:order_id').get(dispatchController.getDispatchItems);      // Get all orders


module.exports = router;

