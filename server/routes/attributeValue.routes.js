const express = require('express');
const router = express.Router();
const attributeValueController = require('../controller/attributevalue.controller');

router.route('/sync')
.get(attributeValueController.syncAttributeValueData); // Sync attribute value data

router.route('/')
  .post(attributeValueController.createAttributeValue)  // Create a new attribute value
  .get(attributeValueController.getAllAttributeValues) // Get all attribute values
  .delete(attributeValueController.deleteAllAttributeValues);


router.route('/group')
  .get(attributeValueController.getByAttributeValueByValue); // Delete an attribute value

  router.route('/:id')
  .put(attributeValueController.updateAttributeValue)    // Update an attribute value
  .delete(attributeValueController.deleteAttributeValue) // Delete an attribute value
  .get(attributeValueController.getByAttributeId); // Delete an attribute value


module.exports = router;
