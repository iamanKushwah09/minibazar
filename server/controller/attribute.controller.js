// controllers/attribute.controller.js
const Attribute = require('../models/attribute.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const axios = require("axios");

// Create a new Attribute
exports.createAttribute = async (req, res) => {
    try {
        const newAttribute = new Attribute(req.body);
        await newAttribute.save();
        res.status(201).json({ message: `Attribute group ${CREATE_MESSAGE}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all Attributes
exports.getAllAttributes = async (req, res) => {
    try {
        const attributes = await Attribute.find()
            .sort({ _id: -1 });
        res.status(200).json(attributes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get an Attribute by ID
exports.getAttributeById = async (req, res) => {
    try {
        const attribute = await Attribute.findById(req.params.id);
        if (!attribute) return res.status(404).json({ message: 'Attribute not found' });
        res.status(200).json(attribute);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an Attribute by ID
exports.updateAttributeById = async (req, res) => {
    try {
        const attribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!attribute) return res.status(404).json({ message: 'Attribute not found' });
        res.status(200).json({ message: `Attribute group ${UPDATE_MESSAGE}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete an Attribute by ID
exports.deleteAttributeById = async (req, res) => {
    try {
        const attribute = await Attribute.findByIdAndDelete(req.params.id);
        if (!attribute) return res.status(404).json({ message: 'Attribute not found' });
        res.status(200).json({ message: `Attribute group ${DELETE_MESSAGE}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete all attributeGroups
exports.deleteAllAttributeGroups = async (req, res) => {
  try {
    const deletedAttributeGroups = await Attribute.deleteMany({});
    return res.status(200).json({
      status: 'success',
      message: `${deletedAttributeGroups.deletedCount} attributeGroups deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting attributeGroups',
      error: error.message
    });
  }
};


exports.activeAttributeGroup = async (req, res) => {
    try {
        const attribute = await Attribute.find({ is_active: true }).select('_id name');
        res.status(200).json(attribute);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.syncAttributeData = async (req, res) => {
    try {
      let attributes;
      if (req.body && req.body.Data) {
        attributes = req.body.Data;
      } else {
        const response = await axios.post(`${process.env.BUSY_API}/Attributes/GetAttributesGroup`);
        attributes = response.data.Data;
      }

      if (attributes && attributes.length > 0) {
        for (const attribute of attributes) {
          try {
            const attributeName = attribute.C1 || attribute.Name || attribute.name;
            if (!attributeName) continue;

            const existingAttribute = await Attribute.findOne({ name: attributeName });
            if (existingAttribute) {
              await Attribute.findOneAndUpdate(
                { name: attributeName },
                { 
                  name: attributeName,
                  is_active: true
                },
                { new: true }
              );
              console.log(`Updated attribute: ${attributeName}`);
            } else {
              await Attribute.create({
                name: attributeName,
                is_active: true
              });
              console.log(`Created new attribute: ${attributeName}`);
            }
          } catch (error) {
            console.error(`Error processing attribute:`, error.message);
          }
        }
        
        console.log('Attribute sync completed successfully');
        if (res) res.status(200).json({ message: 'Attribute groups synced successfully' });
        return true;
      } else {
        console.error('API returned error status or no data');
        if (res) res.status(400).json({ message: 'API returned error status or no data' });
        return false;
      }
    } catch (error) {
      console.error('Error syncing attribute data:', error.message);
      if (res) res.status(500).json({ message: 'Error syncing attribute data' });
      return false;
    }
  };