const Brand = require('../models/brand.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const fileUploadHelper = require('../fileUploader/fileUploadHelper');

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    // const { base64File, fileName } = req.body.image;
    // const cleanedBase64File = base64File.split(';base64,').pop();
    // const uploadPath = await fileUploadHelper.uploadSingleFile(`brand`, fileName, cleanedBase64File);
    // req.body.image = uploadPath;
    const newBrand = new Brand(req.body);
    const savedBrand = await newBrand.save();
    res.status(201).json({ message: `Brand ${CREATE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get brand by ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) throw new Error('Brand not found');
    res.status(200).json(brand);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update a brand by ID
exports.updateBrandById = async (req, res) => {
  try {
    let uploadPath;
    if (req.body?.image?.base64File) {
      const { base64File, fileName } = req.body.image;
      const cleanedBase64File = base64File.split(';base64,').pop();
      uploadPath = await fileUploadHelper.uploadSingleFile(`brand`, fileName, cleanedBase64File);
    } else {
      uploadPath = req.body?.image
    }
    req.body.image = uploadPath || ""
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBrand) throw new Error('Brand not found');
    res.status(200).json({ message: `Brand ${UPDATE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a brand by ID
exports.deleteBrandById = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) throw new Error('Brand not found');
    res.status(200).json({ message: `Brand ${DELETE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all brands
exports.deleteAllbrands = async (req, res) => {
  try {
    const deletedBrands = await Brand.deleteMany({});
    return res.status(200).json({
      status: 'success',
      message: `${deletedBrands.deletedCount} brands deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting brands',
      error: error.message
    });
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
      .sort({ _id: -1 });
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.activeBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ is_active: true }).select('_id name');
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sync brands
exports.syncBrand = async (req, res) => {
  try {
    // Add your sync logic here - this could be syncing with external API
    // For now, just return success message
    res.status(200).json({
      message: "Brands synced successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};