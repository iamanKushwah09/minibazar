const express = require('express');
const router = express.Router();
const attributeController = require('../controller/attribute.controller');

router.route('/sync')
    .get(attributeController.syncAttributeData);

    
router.route('/')
    .post(attributeController.createAttribute)      // Create a new attribute
    .get(attributeController.getAllAttributes)     // Get all attributes
    .delete(attributeController.deleteAllAttributeGroups);

router.route('/active')
    .get(attributeController.activeAttributeGroup)

router.route('/:id')
    .get(attributeController.getAttributeById)       // Get an attribute by ID
    .put(attributeController.updateAttributeById)     // Update an attribute by ID
    .delete(attributeController.deleteAttributeById); // Delete an attribute by ID



module.exports = router;

