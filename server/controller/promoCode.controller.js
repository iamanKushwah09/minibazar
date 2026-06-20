const PromoCode = require('../models/promoCode.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")

// Create a new Promo Code
exports.createPromoCode = async (req, res) => {
    try {
        const newPromoCode = new PromoCode(req.body);
        await newPromoCode.save();
        res.status(201).json({ message: `Promo code ${CREATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Promo Codes
// exports.getAllPromoCodes = async (req, res) => {
//     try {
//         const promoCodes = await PromoCode.find();
//         res.status(200).json(promoCodes);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
exports.getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        const transformedpromoCodes = await Promise.all(
            promoCodes.map(async (promo) => {
                const promoObj = promo.toObject();
                promoObj.expiry_date = new Date(promoObj.expiry_date).toLocaleDateString("en-GB"); // Format to DD/MM/YYYY
                return promoObj;
            }));
        res.status(200).json(transformedpromoCodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Promo Code by ID
exports.getPromoCodeById = async (req, res) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id);
        if (!promoCode) return res.status(404).json({ message: 'Promo Code not found' });
        res.status(200).json(promoCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Promo Code by ID
exports.updatePromoCodeById = async (req, res) => {
    try {
        const updatedPromoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPromoCode) return res.status(404).json({ message: 'Promo Code not found' });
        res.status(200).json({ message: `Promo code ${UPDATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Promo Code by ID
exports.deletePromoCodeById = async (req, res) => {
    try {
        const deletedPromoCode = await PromoCode.findByIdAndDelete(req.params.id);
        if (!deletedPromoCode) return res.status(404).json({ message: 'Promo Code not found' });
        res.status(200).json({ message: `Promo code ${DELETE_MESSAGE}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
