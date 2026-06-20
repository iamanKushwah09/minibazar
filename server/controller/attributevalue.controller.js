// controllers/attributeValue.controller.js
const AttributeValue = require('../models/AttributeValue.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const Attribute = require('../models/attribute.model');
const axios = require("axios");

// Create a new AttributeValue
exports.createAttributeValue = async (req, res) => {
    try {
        const newAttributeValue = new AttributeValue(req.body);
        await newAttributeValue.save();
        res.status(201).json({ message: `Attribute value ${CREATE_MESSAGE}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all AttributeValues
exports.getAllAttributeValues = async (req, res) => {
    try {

        const attributeValues = await AttributeValue.find().populate('attribute_id');
        
        // const attributeValues1 = await AttributeValue.find()
        // .populate({
        //     path: 'attribute_id',
        //     match: { name: attributeName },
        //     select: 'name description' // Only fetch specific fields from Attribute
        // })
        // .exec();

                
            // const admins2 = await AttributeValue.find({})
            // .select("name description is_active")
            // .populate({
            //     path: "attribute_name",
            //     model: "Attributes",
            //     match: { is_active: true },
            //     select: "name description -_id",
            // })
            // .lean(); // Convert to plain JavaScript objects


        const admins = await AttributeValue.find({})
        .sort({ _id: -1 })
        .select("name description is_active")
        .populate({
            path: "attribute_id", // Use the actual field name in the schema
            model: "Attributes",
            match: { is_active: true },
            select: "name -_id",
        })
        .lean(); // Convert to plain JavaScript objects
        const result = admins.map((av) => ({
            ...av,
            attribute_name: av.attribute_id ? av.attribute_id.name : null, // Add attribute_name from attribute_id
        }));
        res.status(200).json(result );
    } catch (err) { 
        console.log(err)
        res.status(500).json({ message: err.message });
    }
};

// Update an AttributeValue
exports.updateAttributeValue = async (req, res) => {
    try {
        const attributeValue = await AttributeValue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!attributeValue) return res.status(404).json({ message: 'AttributeValue not found' });
        res.status(200).json({ message: `Attribute value ${UPDATE_MESSAGE}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete an AttributeValue
exports.deleteAttributeValue = async (req, res) => {
    try {
        const attributeValue = await AttributeValue.findByIdAndDelete(req.params.id);
        if (!attributeValue) return res.status(404).json({ message: 'AttributeValue not found' });
        res.status(200).json({ message: `Attribute value ${DELETE_MESSAGE}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete all attributeValues
exports.deleteAllAttributeValues = async (req, res) => {
  try {
    const deletedAttributeValues = await AttributeValue.deleteMany({});
    return res.status(200).json({
      status: 'success',
      message: `${deletedAttributeValues.deletedCount} attributeValues deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting attributeValues',
      error: error.message
    });
  }
};

exports.getByAttributeId = async (req, res) => { 
    try {
        const attributeValues = await AttributeValue.findById(req.params.id);
        if (!attributeValues || attributeValues.length === 0) {
            return res.status(404).json({ message: 'No attribute values found for the given attribute ID' });
        }
        res.status(200).json(attributeValues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getByAttributeValueByValue = async (req, res) => { 
    try {
        // Fetch all attributes (not just by ID)
        const attributes = await Attribute.find(); // Find all attributes

        if (!attributes || attributes.length === 0) {
            return res.status(404).json({ message: 'No attributes found' });
        }

        let getAttribute = []; // This will store your results
        
        // Iterate over each attribute
        for (let attribute of attributes) {
            let obj = {}; // Create an empty object to hold the results

            // Fetch the corresponding attribute values
            const attributeValues = await AttributeValue.find({ "attribute_id": attribute._id });

            // Assign the attribute's id, name, and its associated values to the object
            obj.id = attribute._id;
            obj.name = attribute.name;
            obj.groupArr = attributeValues;

            obj.groupArr = attributeValues.map(value => ({
                // attribute_id: value.attribute_id,
                attribute_id: value._id,
                name: value.name
            }));
            // Push the object to the getAttribute array
            getAttribute.push(obj);
        }

        // Return the result to the client
        res.status(200).json(getAttribute);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.syncAttributeValueData = async (req, res) => {
    try {
      let attributeValues;
      if (req.body && req.body.Data) {
        attributeValues = req.body.Data;
      } else {
        const response = await axios.post(`${process.env.BUSY_API}/Attributes/GetAttributes`);
        attributeValues = response.data.Data;
      }

      if (attributeValues && attributeValues.length > 0) {
        for (const attribute of attributeValues) {
          try {
            const attributeName = attribute.Attribute || attribute.name;
            const groupName = attribute.AttributeGroup || attribute.attributeGroup;
            if (!attributeName || !groupName) continue;
            
            const existingAttributeGroup = await Attribute.findOne({ name: groupName });
            if (existingAttributeGroup) {
              const existingAttributeValue = await AttributeValue.findOne({ 
                name: attributeName,
                attribute_id: existingAttributeGroup._id 
              });
              
              if (existingAttributeValue) {
                await AttributeValue.findOneAndUpdate(
                  { 
                    name: attributeName,
                    attribute_id: existingAttributeGroup._id 
                  },
                  { 
                    name: attributeName,
                    attribute_id: existingAttributeGroup._id,
                    is_active: true
                  },
                  { new: true }
                );
              } else {
                await AttributeValue.create({
                  name: attributeName,
                  attribute_id: existingAttributeGroup._id,
                  is_active: true
                });
              }
            } else {
              console.error(`Attribute group not found for value sync: ${groupName}`);
            }
          } catch (error) {
            console.error(`Error processing attribute value:`, error.message);
          }
        }
        
        console.log('Attribute value sync completed successfully');
        if (res) res.status(200).json({ message: 'Attribute value sync completed successfully' });
        return true;
      } else {
        console.error('API returned error status or no data');
        if (res) res.status(400).json({ message: 'API returned error status or no data' });
        return false;
      }
    } catch (error) {
      console.error('Error syncing attribute value data:', error.message);
      if (res) res.status(500).json({ message: 'Error syncing attribute value data' });
      return false;
    }
};