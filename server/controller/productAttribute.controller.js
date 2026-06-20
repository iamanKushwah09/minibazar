// controllers/productAttribute.controller.js
const ProductAttribute = require('../models/productAttribute.model');

// Create a new Product Attribute
exports.createProductAttribute = async (req, res) => {
    try {
        const newProductAttribute = new ProductAttribute(req.body);
        await newProductAttribute.save();
        res.status(201).json(newProductAttribute);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a Product Attribute by ID
exports.getProductAttributeById = async (req, res) => {
    try {
        const productAttribute = await ProductAttribute.findById(req.params.id);
        if (!productAttribute) return res.status(404).json({ message: 'Product Attribute not found' });
        res.status(200).json(productAttribute);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a Product Attribute by ID
exports.updateProductAttributeById = async (req, res) => {
    try {
        const productAttribute = await ProductAttribute.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!productAttribute) return res.status(404).json({ message: 'Product Attribute not found' });
        res.status(200).json(productAttribute);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a Product Attribute by ID
exports.deleteProductAttributeById = async (req, res) => {
    try {
        const productAttribute = await ProductAttribute.findByIdAndDelete(req.params.id);
        if (!productAttribute) return res.status(404).json({ message: 'Product Attribute not found' });
        res.status(200).json({ message: 'Product Attribute deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all Product Attributes
exports.getAllProductAttributes = async (req, res) => {
    try {
        const productAttributes = await ProductAttribute.find();
        res.status(200).json(productAttributes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
