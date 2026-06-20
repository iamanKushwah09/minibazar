const express = require('express');
const router = express.Router();
const unitController = require('../controller/unit.controller');

router.route('/sync')
    .get(unitController.syncUnit);         // Sync units with external source

router.route('/')
    .post(unitController.createUnit)       // Create a new unit
    .get(unitController.getAllUnits)      // Get all units
    .delete(unitController.deleteAllUnits);

router.route('/active')
    .get(unitController.activeUnit)        // Get a category by ID

router.route('/:id')
    .get(unitController.getUnitById)       // Get a unit by ID
    .put(unitController.updateUnitById)    // Update a unit by ID
    .delete(unitController.deleteUnitById); // Delete a unit by ID

module.exports = router;


