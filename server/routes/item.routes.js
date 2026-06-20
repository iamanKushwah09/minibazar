const express = require('express');
const router = express.Router();
const itemController = require('../controller/item.controller');
const { validateItem, validateItemId } = require('../validator/item.validator')

router.route('/sync')
  .get(itemController.syncItemData);

router.route('/sync-stock')
  .get(itemController.syncStockData);

router.route('/')
  .post(itemController.createItem)        // Create a new item
  .get(itemController.getAllItems)
  .delete(itemController.deleteAllItems); // Delete all items

router.route('/import')
  .post(itemController.importItems);

router.route('/show')
  .get(itemController.showItem)

router.route('/active')
  .get(itemController.activeItems)        // Get an item group by ID

router.route('/getItemDiscount')
  .post(itemController.getItemDiscount)

router.route('/stock/update/:item_code')
  .put(itemController.updateStockByItemCode)
  .patch(itemController.updateStockByItemCode)

router.route('/stock')
  .get(itemController.getStockByItemCode)

router.route('/:id/code')
  .get(itemController.getItemCode)

router.route('/:id')
  .get(validateItemId, itemController.getItemById)        // Get an item by ID
  .put(itemController.updateItemById)     // Update an item by ID
  .delete(validateItemId, itemController.deleteItemById);  // Delete an item by ID




module.exports = router;



