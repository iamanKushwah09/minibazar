const SaleType = require("../models/SaleType.model");
const axios = require('axios');
const logger = require('../log');

// Create a new sale type
const addSaleType = async (req, res) => {
  try {
    const newSaleType = new SaleType(req.body);
    await newSaleType.save();
    res.status(200).send({
      message: "Sale Type Added Successfully!",
      data: newSaleType
    });
  } catch (err) {
    logger.error(`Error adding sale type: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Add multiple sale types
const addAllSaleTypes = async (req, res) => {
  try {
    // await SaleType.deleteMany();
    await SaleType.insertMany(req.body);
    res.status(200).send({
      message: "Sale Types Added Successfully!",
    });
  } catch (err) {
    logger.error(`Error adding multiple sale types: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get all sale types
const getAllSaleTypes = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    let queryObject = {};
    if (status) {
      queryObject.status = status;
    }
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    const totalDoc = await SaleType.countDocuments(queryObject);
    const saleTypes = await SaleType.find(queryObject)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      saleTypes,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    logger.error(`Error getting sale types: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get active sale types only
const getActiveSaleTypes = async (req, res) => {
  try {
    const saleTypes = await SaleType.find({ status: "active" })
      .select('_id code name')
      .sort({ _id: -1 });
    res.send(saleTypes);
  } catch (err) {
    logger.error(`Error getting active sale types: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

const getSomeSaleTypes = async (req, res) => {
  try {
    // Get sale types with Central-12% first, then Local-12%
    const saleTypes = await SaleType.find({
      name: { $in: ["I/GST-5%", "L/GST-voucher(5%)"] } //Local-5% Local-5% Central-5%
    }).sort({ name: 1 }); // Sort alphabetically to get Central before Local;
    // console.log("Some Sale Type Data: ", saleTypes);
    res.send(saleTypes);
  } catch (err) {
    logger.error(`Error getting some sale types: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Debug endpoint to check sale types
const debugSaleTypes = async (req, res) => {
  try {
    const allSaleTypes = await SaleType.find({});
    const activeSaleTypes = await SaleType.find({ status: 'active' });
    const centralSaleType = await SaleType.findOne({ name: "I/GST-5%" });
    
    res.json({
      total: allSaleTypes.length,
      allSaleTypes,
      activeSaleTypes,
      centralSaleType,
      message: 'Debug info for sale types'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sale type by ID
const getSaleTypeById = async (req, res) => {
  try {
    const saleType = await SaleType.findById(req.params.id);
    if (!saleType) {
      return res.status(404).send({
        message: "Sale Type not found!",
      });
    }
    res.send(saleType);
  } catch (err) {
    logger.error(`Error getting sale type by ID: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Update sale type
const updateSaleType = async (req, res) => {
  try {
    const saleType = await SaleType.findById(req.params.id);
    if (!saleType) {
      return res.status(404).send({
        message: "Sale Type not found!",
      });
    }

    saleType.code = req.body.code || saleType.code;
    saleType.name = req.body.name || saleType.name;
    saleType.status = req.body.status || saleType.status;

    await saleType.save();
    res.send({ 
      message: "Sale Type Updated Successfully!",
      data: saleType
    });
  } catch (err) {
    logger.error(`Error updating sale type: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Update multiple sale types
const updateManySaleTypes = async (req, res) => {
  try {
    await SaleType.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          status: req.body.status,
        },
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Sale Types Updated Successfully!",
    });
  } catch (err) {
    logger.error(`Error updating multiple sale types: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Update status of sale type
const updateStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await SaleType.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      }
    );
    res.status(200).send({
      message: `Sale Type ${
        newStatus === "active" ? "Activated" : "Deactivated"
      } Successfully!`,
    });
  } catch (err) {
    logger.error(`Error updating sale type status: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Delete sale type by ID
const deleteSaleType = async (req, res) => {
  try {
    const saleType = await SaleType.findByIdAndDelete(req.params.id);
    if (!saleType) {
      return res.status(404).send({
        message: "Sale Type not found!",
      });
    }
    res.send({
      message: "Sale Type Deleted Successfully!",
    });
  } catch (err) {
    logger.error(`Error deleting sale type: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Delete multiple sale types
const deleteManySaleTypes = async (req, res) => {
  try {
    await SaleType.deleteMany({ _id: req.body.ids });
    res.send({
      message: "Sale Types Deleted Successfully!",
    });
  } catch (err) {
    logger.error(`Error deleting multiple sale types: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get sale type by code
const getSaleTypeByCode = async (req, res) => {
  try {
    const saleType = await SaleType.findOne({ code: req.params.code });
    
    if (!saleType) {
      return res.status(404).send({
        message: "Sale Type not found!",
      });
    }
    res.send(saleType);
  } catch (err) {
    logger.error(`Error getting sale type by code: ${err.message}`);
    res.status(500).send({
      message: err.message,
    });
  }
};

const syncSaleTypeData = async (req, res) => {
  try {
    console.log('Starting sale type sync at:', new Date().toISOString());
    
    let Data;
    if (req && req.body && req.body.Data) {
      Data = req.body.Data;
    } else {
      const response = await axios.post(`${process.env.BUSY_API}/Account/GetSaleType`);
      Data = response.data.Data;
    }

    if (Data && Data.length > 0) {
      const saleTypes = Data;
      for (const saleType of saleTypes) {
        try {
          // Check if sale type already exists
          const existingSaleType = await SaleType.findOne({ code: saleType.Code });
          if (existingSaleType) {
            // Update existing sale type
            await SaleType.findOneAndUpdate(
              { code: saleType.Code },
              { 
                name: saleType.Name,
                status: 'active'
              },
              { new: true }
            );
            console.log(`Updated sale type: ${saleType.Name} (Code: ${saleType.Code})`);
          } else {
            // Create new sale type
            await SaleType.create({
              code: saleType.Code,
              name: saleType.Name,
              status: 'active'
            });
            console.log(`Created new sale type: ${saleType.Name} (Code: ${saleType.Code})`);
          }
        } catch (error) {
          console.error(`Error processing sale type ${saleType.Code}:`, error.message);
        }
      }
      
      console.log('Sale type sync completed successfully');
      if (res) res.status(200).json({ message: 'Sale type sync completed successfully' });
    } else {
      console.error('API returned error status or no data');
      if (res) res.status(400).json({ message: 'No data received' });
    }
  } catch (error) {
    console.log(error ,'error')
    console.error('Error syncing sale type data:', error.message);
    if (res && !res.headersSent) res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSaleType,
  addAllSaleTypes,
  getSomeSaleTypes,
  getAllSaleTypes,
  getActiveSaleTypes,
  getSaleTypeById,
  getSaleTypeByCode,
  updateSaleType,
  updateManySaleTypes,
  updateStatus,
  deleteSaleType,
  deleteManySaleTypes,
  debugSaleTypes,
  syncSaleTypeData
}; 