const express = require('express');
const router = express.Router();
const {
  getItemAccordingDiscount,
  getItemDiscountById,
  updateItemDiscount,
  deleteItemDiscount,
  itemDiscountDatabase
} = require('../controller/itemDiscountController');

//get item discount from external API
router.post('/get', getItemAccordingDiscount);
router.get('/', getItemAccordingDiscount);
router.get('/:ItemCode/:PartyCode', itemDiscountDatabase);


// //get a item discount
// router.get('/:id', getItemDiscountById);

// //update a item discount
// router.put('/:id', updateItemDiscount);

// //delete a item discount
// router.delete('/:id', deleteItemDiscount);

module.exports = router;