const Category = require('../models/category.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const fileUploadHelper = require('../fileUploader/fileUploadHelper');
const { pathToBase64 } = require('../common/folderToBase64');

const axios = require('axios');


exports.createCategory = async (req, res) => {
  try {

    const images = req.body.image; // Assuming `req.body.image` is an array of image objects
    if (!Array.isArray(images)) {
      return res.status(400).json({ message: "Invalid input: `image` should be an array." });
    }
    const uploadedPaths = await Promise.all(
      images
        .filter((image) => image.base64File && image.fileName) // Remove objects with blank or undefined keys
        .map(async (image) => {
          const { base64File, fileName } = image;
          const cleanedBase64File = base64File.split(';base64,').pop();
          // Upload the file
          return await fileUploadHelper.uploadSingleFile(`category`, fileName, cleanedBase64File);
        })
    );
    // Replace req.body.image with the uploaded paths
    req.body.image = uploadedPaths.length > 0 ? uploadedPaths[0] : "";
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json({ message: `Category ${CREATE_MESSAGE}` });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw new Error('Category not found');

    const categoryWithImage = {
      ...category.toObject(),
      base64File: category.image ? `data:image/png;base64,${pathToBase64(`${process.cwd()}/uploadFile_masale${category.image}`).base64File}` : '',
      fileName: typeof category.image === 'string' ? category.image.split('/').pop() : '',
      url: category.image ? `${process.env.BASE_URL}${category.image}` : ''
    };
    if (!category) throw new Error('Category not found');
    res.status(200).json(categoryWithImage);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
  try {
    const images = req.body.image; // Assuming `req.body.image` is an array of image objects
    const uploadedPaths = await Promise.all(
      images
        .filter((image) => image.base64File && image.fileName) // Remove objects with blank or undefined keys
        .map(async (image) => {
          const { base64File, fileName } = image;
          const cleanedBase64File = base64File.split(';base64,').pop();
          // Upload the file
          return await fileUploadHelper.uploadSingleFile(`category`, fileName, cleanedBase64File);
        })
    );

    // if (req.body?.image?.base64File) {
    //   const { base64File, fileName } = req.body.image;
    //   const cleanedBase64File = base64File.split(';base64,').pop();
    //   uploadPath = await fileUploadHelper.uploadSingleFile(`brand`, fileName, cleanedBase64File);
    // } else {
    //   uploadPath = req.body?.image
    // }

    req.body.image = uploadedPaths.length > 0 ? uploadedPaths[0] : "";
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) throw new Error('Category not found');
    res.status(200).json({ message: `Category ${UPDATE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) throw new Error('Category not found');
    res.status(200).json({ message: `Category ${DELETE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all categories
exports.deleteAllCategories = async (req, res) => {
  try {
    const deletedCategories = await Category.deleteMany({});
    return res.status(200).json({
      status: 'success',
      message: `${deletedCategories.deletedCount} categories deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting categories',
      error: error.message
    });
  }
};


// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ _id: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.activeCategories = async (req, res) => {
  try {
    const categories = await Category.find({ is_active: true }).select('_id name');
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.structureCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





exports.syncBusyCategories = async (req, res) => {
  try {
    const config = {
      method: 'post',
      url: `${process.env.BUSY_API}/item/GetItemCategory`,
      timeout: 5000
    };

    const response = await axios.request(config);
    const { Data } = response.data;

    if (!Data || Data.length === 0) {
      return res.status(404).json({ message: 'No data received from Busy Item Category API' });
    }

    for (const { Code, Name } of Data) {
      if (!Name || !Code) continue;

      const existingCategory = await Category.findOne({
        name: Name
      });

      if (existingCategory) {
        // If found, update it
        existingCategory.name = Name;
        existingCategory.is_active = true;
        existingCategory.status = 'show';
        await existingCategory.save();
      } else {
        // If not found, create it
        const newCategory = new Category({
          name: Name,
          description: '',
          is_active: true,
          is_parent_category: false,
          image: {},
          status: 'show'
        });

        await newCategory.save();
      }
    }

    res.status(200).json({
      message: 'Busy item categories synced successfully.'
    });

  } catch (error) {
    console.error('Error syncing categories:', error);
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ message: 'Request timeout - API took too long to respond' });
    }
    res.status(500).json({ message: error.message });
  }
};
