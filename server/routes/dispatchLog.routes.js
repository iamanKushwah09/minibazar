const express = require('express');
const dispatchLogController = require('../controller/dispatchLog.controller');
const router = express.Router();

router.route('/')
  .post(dispatchLogController.createDispatchLog)      // Create a new dispatch log
  .get(dispatchLogController.getAllDispatchLogs);      // Get all dispatch logs

  router.get("/order/:orderDetailsId", dispatchLogController.getDispatchLogsByOrderDetailsId); // Get dispatch logs by orderDetails_id


router.route('/:id')
  .get(dispatchLogController.getDispatchLogById);      // Get a dispatch log by ID


module.exports = router