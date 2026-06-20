const Offer = require('../models/offer.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")

// Create a new offer
exports.createOffer = async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    const savedOffer = await newOffer.save();
    res.status(201).json({ message: `Offer ${CREATE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get offer by ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
    // .populate('item_id');
    // console.log({ offer })
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.status(200).json(offer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update an offer by ID
exports.updateOfferById = async (req, res) => {
  try {
    const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOffer) throw new Error('Offer not found');
    res.status(200).json({ message: `Offer ${UPDATE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an offer by ID
exports.deleteOfferById = async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
    if (!deletedOffer) throw new Error('Offer not found');
    res.status(200).json({ message: `Offer ${DELETE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all offers
// exports.getAllOffers = async (req, res) => {
//   try {
//     const offers = await Offer.find().populate('item_id');
//     res.status(200).json(offers);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
    // .populate('item_id', 'name _id') // Populate only the name and _id fields
    // .exec();
    res.status(200).json(offers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
