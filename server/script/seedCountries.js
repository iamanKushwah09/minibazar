require("dotenv").config();
const { connectDB } = require("../config/db");
const Country = require("../models/Country");
const countriesData = require("../utils/countries");

connectDB();

const seedCountries = async () => {
  try {
    // Check if countries already exist
    const existingCountries = await Country.countDocuments();
    
    if (existingCountries > 0) {
      console.log(`${existingCountries} countries already exist in database`);
      process.exit();
      return;
    }

    // Insert countries data
    await Country.insertMany(countriesData);
    console.log("Countries data inserted successfully!");
    
    // Verify insertion
    const count = await Country.countDocuments();
    console.log(`Total countries in database: ${count}`);
    
    process.exit();
  } catch (error) {
    console.error("Error seeding countries:", error);
    process.exit(1);
  }
};

seedCountries();