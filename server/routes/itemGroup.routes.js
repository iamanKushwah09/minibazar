const express = require('express');
const router = express.Router();
const itemGroupController = require('../controller/itemGroup.controller');
const { validateItemId , validateItemGroup } = require('../validator/itemgroup.validator')

router.route('/refresh').get(itemGroupController.syncItemGroupData);

router.route('/')
  .post(validateItemGroup , itemGroupController.createItemGroup)       // Create a new item group
  .get(itemGroupController.getAllItemGroups)       // Get all item groups
  .delete(itemGroupController.deleteAllItemGroups);

router.route('/active')
  .get(itemGroupController.activeItemGroups)        // Get an item group by ID

router.route('/:id')
  .get(validateItemId ,itemGroupController.getItemGroupById)        // Get an item group by ID
  .put(itemGroupController.updateItemGroupById)     // Update an item group by ID
  .delete(validateItemId ,itemGroupController.deleteItemGroupById);  // Delete an item group by ID


module.exports = router;

