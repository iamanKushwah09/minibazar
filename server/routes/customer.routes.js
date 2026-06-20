const express = require('express');
const customerController = require('../controller/customer.controller');
const router = express.Router();
const { validateCustomer, validateCustomerId } = require('../validator/customer.validator')

router.route('/refresh').get(customerController.getBusyRefreshData)
router.route('/party-ledger').post(customerController.getPartyLedger)
router.route('/party-ledger-pdf').post(customerController.getPartyLedgerPDF)
router.route('/bill-receivable').post(customerController.getBillReceivable);

router.route('/')
    .post(validateCustomer, customerController.createCustomer)
    .get(customerController.getAllCustomers)
    .delete(customerController.deleteAllCustomers);

router.route('/active').get(customerController.getCustomerNameAndId);

// Find or create customer by mobile (for guest checkout)
router.route('/find-or-create-by-mobile').post(customerController.findOrCreateCustomerByMobile);

router.route('/:id')
    .get(validateCustomerId, customerController.getCustomerById)
    .put(customerController.updateCustomerById)
    .delete(validateCustomerId, customerController.deleteCustomerById);

module.exports = router;