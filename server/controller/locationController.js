const Country = require("../models/Country");
const State = require("../models/State");
const City = require("../models/City");

// Get individual country record by ID
exports.getCountry = async (req, res) => {
    try {
        const country = await Country.find();
        if (!country) {
            return res.status(404).json({ message: "Country not found" });
        }
        res.json(country);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get individual state record by ID
exports.getStateById = async (req, res) => {
    try {
        const state = await State.find({country_id:req.params.id});
        
        if (!state) {
            return res.status(404).json({ message: "State not found" });
        }
        res.json(state);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get individual city record by ID
exports.getCityByCountryAndStateId = async (req, res) => {
    try {
        const { country_id, state_id } = req.params; // Destructure params
        const city = await City.find({ country_id, state_id }); // Query using both fields
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }
        res.json(city);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

