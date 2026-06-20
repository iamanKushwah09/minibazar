const express = require("express");
const router = express.Router();
const locationController = require("../controller/locationController");
// Route to get all countries
router.get("/countries", locationController.getCountry);
// Route to get a state by ID
router.get("/states/:id", locationController.getStateById);
// Route to get a city by country ID and state ID
router.get("/cities/:country_id/:state_id", locationController.getCityByCountryAndStateId);
module.exports = router;



