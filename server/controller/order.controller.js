// controllers/order.controller.js
const Order = require('../models/order.model');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).exec();
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an order by ID
exports.updateOrderById = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete an order by ID
exports.deleteOrderById = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id).exec();
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().exec();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
