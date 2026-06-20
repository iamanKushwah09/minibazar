const express = require('express');
const router = express.Router();
const salesController = require('../controller/sales.controller');
const {validateSalesman} = require('../validator/salesman.validator');


router.route('/refresh').get(salesController.getBusyRefreshSaleman);
router.route('/')
  .post( validateSalesman , salesController.createSalesman)
  .get(salesController.getSalesman)
  .delete(salesController.deleteAllSalesman);
router.get('/active', salesController.getSalesmanNameAndId);
router.route('/:id')
  .get(salesController.getSalesmanById)
  .put(salesController.updateSalesmanById)
  .delete(salesController.deleteSalesmanById);
module.exports = router;

