const express = require('express');
const router = express.Router();
const saleOrderController = require('../controller/saleorder.controller');
const { validateDateRange } = require('../middleware/dateValidation.middleware');
// const {validateSaleOrder} = require('../validator/saleOrder.validator');

router.route('/')
  .post(saleOrderController.createSaleOrder)
  .get(saleOrderController.getSaleOrder);

// Search endpoint (MUST be before parameterized routes)
router.route('/search')
  .get(saleOrderController.searchSaleOrders);

// Date range filter endpoint with validation middleware (MUST be before parameterized routes)
router.route('/filter')
  .get(validateDateRange, saleOrderController.getSaleOrdersByDateRange);

router.route('/:saleorderid')
  .get(saleOrderController.getSaleOrderById)
  .put(saleOrderController.updateSaleOrderById)
  .delete(saleOrderController.deleteSaleOrderById);
router.route('/customer/:customerId')
  .get(saleOrderController.getSaleOrdersByCustomer);
router.route('/customer/:customerId/history')
  .get(saleOrderController.getOrderHistoryByCustomer);
router.route('/:saleorderid/dispatch').patch(saleOrderController.dispatchUpdate);
router.route('/dashboard/data').get(saleOrderController.getDashboardData);

// Robust sale order processing endpoint
router.route('/process/:saleorderid')
  .post(saleOrderController.processSaleOrder)
  .get(saleOrderController.processSaleOrder);

module.exports = router;
