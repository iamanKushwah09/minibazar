const express = require('express');
const router = express.Router();
const {
  addBillSundry,
  getAllBillSundries,
} = require('../controller/billSundryController');

//add a bill sundry
router.post('/add', addBillSundry);

//get all bill sundries
router.get('/', getAllBillSundries);

module.exports = router;