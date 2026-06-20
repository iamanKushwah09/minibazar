const express = require('express');
const router = express.Router();
const {
  addSundryDiscount,
  addAllSundryDiscounts,
  getAllSundryDiscounts,
  getSundryDiscountById,
  updateSundryDiscount,
  updateManySundryDiscounts,
  deleteSundryDiscount,
  deleteManySundryDiscounts,
  getSundryDiscountsByPartyGroup,
} = require('../controller/sundryDiscountController');

//add a sundry discount
router.post('/add', addSundryDiscount);

//add multiple sundry discounts
router.post('/add/all', addAllSundryDiscounts);

//get all sundry discounts
router.get('/', getAllSundryDiscounts);

//get sundry discounts by party group
router.post('/party-group', getSundryDiscountsByPartyGroup);

//get a sundry discount
router.get('/:id', getSundryDiscountById);

//update a sundry discount
router.put('/:id', updateSundryDiscount);

//update many sundry discounts
router.patch('/update/many', updateManySundryDiscounts);

//delete a sundry discount
router.delete('/:id', deleteSundryDiscount);

//delete many sundry discounts
router.patch('/delete/many', deleteManySundryDiscounts);

module.exports = router; 