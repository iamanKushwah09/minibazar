const Shipping = require('../models/shipping.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")

// Create a new Shipping record
exports.createShipping = async (req, res) => {
    try {
        const newShipping = new Shipping(req.body);
        await newShipping.save();
        res.status(201).json({ message: `Shipping ${CREATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Shipping records
exports.getAllShippings = async (req, res) => {
    try {
        const shippings = await Shipping.find();
        res.status(200).json(shippings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Shipping record by ID
exports.getShippingById = async (req, res) => {
    try {
        const shipping = await Shipping.findById(req.params.id);
        if (!shipping) return res.status(404).json({ message: 'Shipping record not found' });
        res.status(200).json(shipping);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Shipping record by ID
exports.updateShippingById = async (req, res) => {
    try {
        const updatedShipping = await Shipping.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedShipping) return res.status(404).json({ message: 'Shipping record not found' });
        res.status(200).json({ message: `Shipping ${UPDATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Shipping record by ID
exports.deleteShippingById = async (req, res) => {
    try {
        const deletedShipping = await Shipping.findByIdAndDelete(req.params.id);
        if (!deletedShipping) return res.status(404).json({ message: 'Shipping record not found' });
        res.status(200).json({ message: `Shipping ${DELETE_MESSAGE}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
