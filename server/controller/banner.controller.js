const Banner = require('../models/banner.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const fileUploadHelper = require('../fileUploader/fileUploadHelper');

// Create a new Banner
exports.createBanner = async (req, res) => {
    try {
        const { base64File, fileName } = req.body.image;
        const cleanedBase64File = base64File.split(';base64,').pop();
        const uploadPath = await fileUploadHelper.uploadSingleFile(`banner`, fileName, cleanedBase64File);
        req.body.image = uploadPath;
        const newBanner = new Banner(req.body);
        await newBanner.save();
        res.status(201).json({ message: `Banner ${CREATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Banners
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Banner by ID
exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Banner by ID
exports.updateBannerById = async (req, res) => {
    try {
        let uploadPath;
        if (req.body?.image?.base64File) {
            const { base64File, fileName } = req.body.image;
            const cleanedBase64File = base64File.split(';base64,').pop();
            uploadPath = await fileUploadHelper.uploadSingleFile(`banner`, fileName, cleanedBase64File);
        } else {
            uploadPath = req.body?.image
        }
        req.body.image = uploadPath || ""
        const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBanner) return res.status(404).json({ message: 'Banner not found' });
        res.status(200).json({ message: `Banner ${UPDATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Banner by ID
exports.deleteBannerById = async (req, res) => {
    try {
        const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
        if (!deletedBanner) return res.status(404).json({ message: 'Banner not found' });
        res.status(200).json({ message: `Banner ${DELETE_MESSAGE}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
