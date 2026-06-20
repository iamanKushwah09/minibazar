const Unit = require('../models/Unit');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const axios = require('axios');


// Create a new unit
exports.createUnit = async (req, res) => {
    try {
        const unit = new Unit(req.body);
        await unit.save();
        res.status(201).json({ message: `Unit ${CREATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all units
exports.getAllUnits = async (req, res) => {
    try {
        const units = await Unit.find();
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a unit by ID
exports.getUnitById = async (req, res) => {
    try {
        const unit = await Unit.findById(req.params.id);
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        res.status(200).json(unit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a unit by ID
exports.updateUnitById = async (req, res) => {
    try {
        const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        res.status(200).json({ message: `Unit ${UPDATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a unit by ID
exports.deleteUnitById = async (req, res) => {
    try {
        const unit = await Unit.findByIdAndDelete(req.params.id);
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        res.status(200).json({ message: `Unit ${DELETE_MESSAGE}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete all units
exports.deleteAllUnits = async (req, res) => {
  try {
    const deletedUnits = await Unit.deleteMany({});
    return res.status(200).json({
      status: 'success',
      message: `${deletedUnits.deletedCount} units deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting units',
      error: error.message
    });
  }
};


exports.activeUnit = async (req, res) => {
    try {
        const unit = await Unit.find({ is_active: true }).select('_id name');
        res.status(200).json(unit);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.syncUnit = async (req, res) => {
    let units;
    if (req.body && req.body.Data) {
        units = req.body.Data;
    } else {
        const response = await axios.post(`${process.env.BUSY_API}/Item/GetItemUnitMaster`); 
        units = response.data.Data;
    }
    console.log("Units to sync:", units);
    try {
        for (const unit of units) {
            const existingUnit = await Unit.findOne({ name: unit.Name });
            if (!existingUnit) {
                const newUnit = new Unit({
                    name: unit.Name,
                    is_active: true
                });
                await newUnit.save();
            } else {
                existingUnit.is_active = true;
                await existingUnit.save();
            }
        }
        res.status(200).json({ message: 'Units synchronized successfully' });
    } catch (error) {
        console.error("Error syncing units:", error.message);
        res.status(500).json({ error: error.message });
    }
}