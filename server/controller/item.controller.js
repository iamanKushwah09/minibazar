const Item = require('../models/item.model');
const fileUploadHelper = require('../fileUploader/fileUploadHelper');
const { pathToBase64 } = require('../common/folderToBase64');
const itemGroupModel = require('../models/itemGroup.model');
const axios = require('axios');
const CategoryModel = require('../models/category.model');
const UnitModel = require('../models/Unit');
const Attribute = require('../models/Attribute');
const mongoose = require('mongoose');

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const images = req.body.image;
    if (!Array.isArray(images)) {
      return res.status(400).json({ message: "Invalid input: `image` should be an array." });
    }

    if (Array.isArray(images)) {
      const uploadedPaths = await Promise.all(
        images.map(async (image) => {
          if (image.base64File && image.fileName) {
            const { base64File, fileName } = image;
            const cleanedBase64File = base64File.split(';base64,').pop();
            const folderPath = `items/${req.body.item_code || 'unknown'}`;
            return await fileUploadHelper.uploadSingleFile(folderPath, fileName.replace(/\s+/g, ''), cleanedBase64File, true);
          }
          const relativePath = image.url ? image.url.replace(process.env.BASE_URL, '') : (typeof image === 'string' ? image : '');
          return relativePath;
        })
      );
      req.body.image = uploadedPaths.filter(p => p !== '');
      if (req.body.image.length === 0) {
        req.body.image = [{ path: '/default/default_image.png', image_url: '' }];
      }
    }

    if (Array.isArray(req.body?.item_attribute?.variant)) {
      await Promise.all(req.body.item_attribute.variant.map(async (variant) => {
        if (Array.isArray(variant.attribute_image) && variant.attribute_image.length > 0) {
          const uploadedPaths = await Promise.all(
            variant.attribute_image.map(async (image) => {
              if (image.base64File && image.fileName) {
                const cleanedBase64File = image.base64File.split(';base64,').pop();
                // Upload the file to 'item-attribute'
                const folderPath = `items/${req.body.item_code || 'unknown'}`;
                return await fileUploadHelper.uploadSingleFile(folderPath, image.fileName.replace(/\s+/g, ''), cleanedBase64File, true);
              }
              // Handle existing URLs/paths
              const relativePath = image.url ? image.url.replace(process.env.BASE_URL, '') : (typeof image === 'string' ? image : '');
              return relativePath;
            })
          );
          variant.attribute_image = uploadedPaths.filter(p => p !== '');
        }
      }));
    }

    // Replace req.body.image with the uploaded paths
    // console.log(req.body,'req.body');

    // Sanitize empty strings for ObjectId fields
    const objectIdFields = ['category_id', 'item_group_id', 'brand_id', 'unit_id'];
    objectIdFields.forEach(field => {
      if (req.body[field] === "") {
        req.body[field] = null; // Prevent CastError
      }
    });

    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    return res.status(201).json({
      status: 'success',
      message: 'Item created successfully',
      data: savedItem
    });
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed while creating the item',
        error: error.message
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating the item',
      error: error.message
    });
  }
};

// Delete all items
exports.deleteAllItems = async (req, res) => {
  try {
    console.log("Deleting all items... in ItemController.js");
    const deletedItems = await Item.deleteMany({});
    return res.status(200).json({
      status: 'success',
      message: `${deletedItems.deletedCount} items deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting items',
      error: error.message
    });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {

    const item = await Item.findById(req.params.id).lean();
    if (!item) {
      return res.status(204).send(); // No Content if item not found
    }
    const processedItem = {
      ...item,
      image: item.image?.[0] || {} // Safely access first image
    };
    if (item.image && item.image.length > 0) {
      console.log(item.image, 'item.image')
      processedItem.images = item.image.map(img => {
        if (!img) return { base64File: '', fileName: '', url: '' };
        try {
          // If img is already an object with url, use it, otherwise treat string as path
          let relativePath = typeof img === 'string' ? img : (img.image_url ? img.image_url : (img.url ? img.url.replace(process.env.BASE_URL, '') : (img.path || '')));
          if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
            return {
              base64File: '',
              fileName: relativePath.split('/').pop(),
              url: relativePath
            };
          }
          // const filePath = `${process.cwd()}/uploadFile_masale${relativePath}`;
          const filePath = require('path').join(process.cwd(), 'uploadFile_masale', relativePath);
          const { base64File, fileName } = pathToBase64(filePath);
          return {
            base64File: base64File ? `data:image/png;base64,${base64File}` : '',
            fileName: fileName || (typeof relativePath === 'string' ? relativePath.split('/').pop() : ''),
            url: relativePath ? `${process.env.BASE_URL}${relativePath}` : ''
          };
        } catch (err) {
          console.error(`Error processing image: ${err.message}`);
          return { base64File: '', fileName: '', url: '' };
        }
      });
    } else {
      processedItem.images = [];
    }

    if (item.item_attribute?.variant) {
      await Promise.all(item.item_attribute.variant.map(async variant => {
        if (variant.attribute_image && Array.isArray(variant.attribute_image)) {
          const processedImages = variant.attribute_image.map(img => {
            if (!img) return { base64File: '', fileName: '', url: '' };
            try {
              let relativePath = typeof img === 'string' ? img : (img.image_url ? img.image_url : (img.url ? img.url.replace(process.env.BASE_URL, '') : (img.path || '')));
              if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
                return {
                  base64File: '',
                  fileName: relativePath.split('/').pop(),
                  url: relativePath
                };
              }
              const filePath = require('path').join(process.cwd(), 'uploadFile_masale', relativePath);
              const { base64File, fileName } = pathToBase64(filePath);
              return {
                base64File: base64File ? `data:image/png;base64,${base64File}` : '',
                fileName: fileName || (typeof relativePath === 'string' ? relativePath.split('/').pop() : ''),
                url: relativePath ? `${process.env.BASE_URL}${relativePath}` : ''
              };
            } catch (err) {
              console.error(`Error processing variant image: ${err.message}`);
              return { base64File: '', fileName: '', url: '' };
            }
          });
          variant.attribute_image = processedImages;
        }
      }));
    }

    // console.log(processedItem)

    return res.status(200).json(processedItem);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while retrieving the item',
      error: error.message
    });
  }
};

// Update an item by ID
exports.updateItemById = async (req, res) => {
  try {

    const item = await Item.findOne({ _id: req.params.id }).populate({ path: 'category_id', match: { is_active: true } }).exec();
    const images = req.body.image;
    if (Array.isArray(images) && images.length > 0) {
      const uploadedPaths = await Promise.all(
        images
          .filter((image) => image.base64File && image.fileName)
          .map(async (image) => {
            const { base64File, fileName } = image;
            const cleanedBase64File = base64File.split(';base64,').pop();
            return await fileUploadHelper.uploadSingleFile(`items/${item?.item_code || 'unknown'}`, fileName.replace(/\s+/g, ''), cleanedBase64File, true);
          })
      );
      // Replace image array with uploaded paths
      req.body.image = uploadedPaths;
    } else {
      req.body.image = [{ path: '/default/default_image.png', image_url: '' }];
    }

    // Process variant images during update
    if (Array.isArray(req.body?.item_attribute?.variant)) {
      await Promise.all(req.body.item_attribute.variant.map(async (variant) => {
        if (Array.isArray(variant.attribute_image) && variant.attribute_image.length > 0) {
          const uploadedPaths = await Promise.all(
            variant.attribute_image.map(async (image) => {
              if (image.base64File && image.fileName) {
                const cleanedBase64File = image.base64File.split(';base64,').pop();
                // Upload the file to 'item-attribute' for variants
                return await fileUploadHelper.uploadSingleFile(`items/${item?.item_code || 'unknown'}`, image.fileName.replace(/\s+/g, ''), cleanedBase64File, true);
              }
              // Handle existing URLs/paths correctly
              const relativePath = image.url ? image.url.replace(process.env.BASE_URL, '') : (typeof image === 'string' ? image : '');
              return relativePath;
            })
          );
          variant.attribute_image = uploadedPaths.filter(p => p !== '');
        }
      }));
    }


    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(204).send();
    }
    return res.status(200).json({
      status: 'success',
      message: 'Item updated successfully',
      data: updatedItem
    });

  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed while updating the item',
        error: error.message
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating the item',
      error: error.message
    });
  }
};

// exports.updateItemById = async (req, res) => {
//   try {

//     const item = await Item.findOne({ _id: req.params.id }).populate({ path: 'category_id', match: { is_active: true } }).exec();
//     const images = req.body.image; // Get image array from request body
//     if (Array.isArray(images) && images.length > 0) {
//       const uploadedPaths = await Promise.all(
//         images
//           .filter((image) => image.base64File && image.fileName)
//           .map(async (image) => {
//             const { base64File, fileName } = image;
//             const cleanedBase64File = base64File.split(';base64,').pop();
//             return await fileUploadHelper.uploadSingleFile(`items/${item?.item_code || 'unknown'}`, fileName.replace(/\s+/g, ''), cleanedBase64File);
//           })
//       );
//       // Replace image array with uploaded paths
//       req.body.image = uploadedPaths;
//     } else {
//       req.body.image = '/default/default_image.png';
//     }


//     const updatedItem = await Item.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedItem) {
//       return res.status(204).send();
//     }
//     return res.status(200).json({
//       status: 'success',
//       message: 'Item updated successfully',
//       data: updatedItem
//     });

//   } catch (error) {
//     console.log(error)
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Validation failed while updating the item',
//         error: error.message
//       });
//     }
//     return res.status(500).json({
//       status: 'error',
//       message: 'Internal server error while updating the item',
//       error: error.message
//     });
//   }
// };


// Delete an item by ID
exports.deleteItemById = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(204).send(); // No Content if item not found
    }
    return res.status(200).json({
      status: 'success',
      message: 'Item deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting the item',
      error: error.message
    });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {

    function buildSafeRegex(input) {
      return new RegExp(
        input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );
    }

    function escapeRegexChar(char) {
      return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    function buildSafeFuzzyRegex(input) {
      let pattern = '';

      for (const char of input) {
        pattern += `${escapeRegexChar(char)}\\s*`;
      }

      return new RegExp(pattern, 'i');
    }
    let { page, limit, q, itemGroup, category, stockMin, stockMax } = req.query;
    // q = escapeRegex(q);
    // If pagination or search is requested, use paginated response
    if ((page && Number(page) > 0) || (limit && Number(limit) > 0) || (q && String(q).trim().length > 0) || itemGroup || category || stockMin || stockMax) {
      const currentPage = Math.max(1, Number(page) || 1);
      const perPage = Math.max(1, Math.min(100, Number(limit) || 10));
      const skip = (currentPage - 1) * perPage;
      // Build search query
      const query = {};

      // Add text search conditions
      // if (q && String(q).trim().length > 0) {
      //   const search = String(q).trim();
      //   // Create fuzzy search pattern that allows optional spaces between characters
      //   const fuzzyPattern = search.split('').join('\\s*');
      //   const orQuery = [
      //     { name: { $regex: search, $options: 'i' } },
      //     { name: { $regex: fuzzyPattern, $options: 'i' } },
      //     { alias: { $regex: search, $options: 'i' } },
      //     { alias: { $regex: fuzzyPattern, $options: 'i' } },
      //     { print_name: { $regex: search, $options: 'i' } },
      //     { print_name: { $regex: fuzzyPattern, $options: 'i' } },
      //     { category: { $regex: search, $options: 'i' } },
      //     { category: { $regex: fuzzyPattern, $options: 'i' } },
      //     { specification: { $regex: search, $options: 'i' } },
      //     { specification: { $regex: fuzzyPattern, $options: 'i' } },
      //     { short_description: { $regex: search, $options: 'i' } },
      //     { short_description: { $regex: fuzzyPattern, $options: 'i' } },
      //     { long_description: { $regex: search, $options: 'i' } },
      //     { long_description: { $regex: fuzzyPattern, $options: 'i' } },
      //     { hsn_code: { $regex: search, $options: 'i' } },
      //     { hsn_code: { $regex: fuzzyPattern, $options: 'i' } },
      //     { 'category.name': { $regex: search, $options: 'i' } },
      //     { 'category.name': { $regex: fuzzyPattern, $options: 'i' } },
      //     { 'item_group.name': { $regex: search, $options: 'i' } },
      //     { 'item_group.name': { $regex: fuzzyPattern, $options: 'i' } },
      //   ];


      //   // If q is a number, also try to match item_code equality
      //   const qNum = Number(search);
      //   if (!Number.isNaN(qNum)) {
      //     orQuery.push({ item_code: qNum });
      //     orQuery.push({ mrp: qNum });
      //     orQuery.push({ sale_price: qNum });
      //   }
      //   query.$or = orQuery;
      // }

      if (q && String(q).trim().length > 0) {
        const rawSearch = String(q).trim();

        const normalRegex = buildSafeRegex(rawSearch);
        const fuzzyRegex = buildSafeFuzzyRegex(rawSearch);

        const orQuery = [
          { name: normalRegex },
          { name: fuzzyRegex },

          { alias: normalRegex },
          { alias: fuzzyRegex },

          { print_name: normalRegex },
          { print_name: fuzzyRegex },

          { category: normalRegex },
          { category: fuzzyRegex },

          { specification: normalRegex },
          { specification: fuzzyRegex },

          { short_description: normalRegex },
          { short_description: fuzzyRegex },

          { long_description: normalRegex },
          { long_description: fuzzyRegex },

          { hsn_code: normalRegex },
          { hsn_code: fuzzyRegex },

          { 'category.name': normalRegex },
          { 'category.name': fuzzyRegex },

          { 'item_group.name': normalRegex },
          { 'item_group.name': fuzzyRegex },

          { item_code: normalRegex },
          { item_code: fuzzyRegex },
        ];

        const qNum = Number(rawSearch);
        if (!Number.isNaN(qNum)) {
          orQuery.push({ mrp: qNum });
          orQuery.push({ sale_price: qNum });
        }

        query.$or = orQuery;
      }



      // Add filter conditions
      if (itemGroup && itemGroup.trim()) {
        query.item_group = {
          $elemMatch: {
            name: { $regex: itemGroup, $options: 'i' }
          }
        };
      }

      if (category && category.trim()) {
        query.category = {
          $elemMatch: {
            name: { $regex: category, $options: 'i' }
          }
        };
      }

      if (stockMin && stockMin.trim() && !isNaN(Number(stockMin))) {
        query.stock = { ...query.stock, $gte: Number(stockMin) };
      }

      if (stockMax && stockMax.trim() && !isNaN(Number(stockMax))) {
        query.stock = { ...query.stock, $lte: Number(stockMax) };
      }

      const lookups = [
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $lookup: {
            from: 'itemgroups',
            localField: 'item_group_id',
            foreignField: '_id',
            as: 'item_group'
          }
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'brand_id',
            foreignField: '_id',
            as: 'brand'
          }
        },
        {
          $lookup: {
            from: 'units',
            localField: 'unit_id',
            foreignField: '_id',
            as: 'unit'
          }
        }
      ];

      const countPipeline = [
        ...lookups,
        { $match: query },
        { $count: "total" }
      ];
      const countResult = await Item.aggregate(countPipeline);
      const totalDoc = countResult[0]?.total || 0;

      const itemsPipeline = [
        ...lookups,
        { $match: query },
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: perPage }
      ];
      const items = await Item.aggregate(itemsPipeline);

      const populatedItems = items.map(item => ({
        ...item,
        category_id: item.category?.[0] || null,
        item_group_id: item.item_group?.[0] || null,
        brand_id: item.brand?.[0] || null,
        unit_id: item.unit?.[0] || null,
      }));

      const processed = await Promise.all(populatedItems.map(async (item) => {
        const processedItem = {
          ...item,
          image: item.image?.[0] || {}
        };

        if (item.image && item.image.length > 0) {
          processedItem.images = item.image?.map((img) => {
            if (!img) return { base64File: '', fileName: '', url: '' };
            try {
              let relativePath = typeof img === 'string' ? img : (img.image_url ? img.image_url : (img.url ? img.url.replace(process.env.BASE_URL, '') : (img.path || '')));
              if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
                return {
                  base64File: '',
                  fileName: relativePath.split('/').pop(),
                  url: relativePath
                };
              }
              const filePath = require('path').join(process.cwd(), 'uploadFile_masale', relativePath);
              const { base64File, fileName } = pathToBase64(filePath);
              return {
                base64File: base64File ? `data:image/png;base64,${base64File}` : '',
                fileName: fileName || (typeof relativePath === 'string' ? relativePath.split('/').pop() : ''),
                url: relativePath ? `${process.env.BASE_URL}${relativePath}` : ''
              };
            } catch (err) {
              console.error(`Error processing image: ${err.message}`);
              return { base64File: '', fileName: '', url: '' };
            }
          });
        } else {
          processedItem.images = [];
        }
        return processedItem;
      }));

      return res.status(200).json({
        items: processed,
        totalDoc,
        limits: perPage,
        pages: currentPage,
      });
    }

    // Default: keep legacy behavior (return full array without pagination)
    const items = await Item.find()
      .populate('category_id item_group_id brand_id unit_id')
      .sort({ _id: -1 })
      .lean()
      .then(items => items.map(item => {
        const processedItem = {
          ...item,
          image: item.image?.[0] || {}
        };
        if (item.image && item.image.length > 0) {
          processedItem.images = item.image?.map(img => {
            if (!img) return { base64File: '', fileName: '', url: '' };
            try {
              let relativePath = typeof img === 'string' ? img : (img.image_url ? img.image_url : (img.url ? img.url.replace(process.env.BASE_URL, '') : (img.path || '')));
              if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
                return {
                  base64File: '',
                  fileName: relativePath.split('/').pop(),
                  url: relativePath
                };
              }
              const filePath = require('path').join(process.cwd(), 'uploadFile_masale', relativePath);
              const { base64File, fileName } = pathToBase64(filePath);
              return {
                base64File: base64File ? `data:image/png;base64,${base64File}` : '',
                fileName: fileName || (typeof relativePath === 'string' ? relativePath.split('/').pop() : ''),
                url: relativePath ? `${process.env.BASE_URL}${relativePath}` : ''
              };
            } catch (err) {
              console.error(`Error processing image: ${err.message}`);
              return { base64File: '', fileName: '', url: '' };
            }
          });
        } else {
          processedItem.images = [];
        }
        return processedItem;
      }));
    return res.status(200).json(items);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while retrieving items',
      error: error.message
    });
  }
};

// exports.activeItems = async (req, res) => {

//   try {
//     const Items = await Item.find({ is_active: true }).select('_id name image stock');
//     res.status(200).json(Items);
//   } catch (error) {
//     return res.status(500).json({
//       status: 'error',
//       message: 'Internal server error while retrieving items',
//       error: error.message
//     });
//   }
// };

exports.activeItems = async (req, res) => {
  try {
    const Items = await Item.find(
      {
        is_active: true,
        // name: "Trv DC50 BLACK/WHITE 7x10"   // ➜ your condition
      },
      {
        _id: 1,
        name: 1,
        stock: 1,
        image: { $slice: 1 }               // ➜ only first image
      }
    );
    res.status(200).json(Items);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while retrieving items',
      error: error.message
    });
  }
};



// exports.showItem = async (req, res) => {
//   try {

//     const items = await Item.find().populate('category_id item_group_id brand_id unit_id').lean();
//     const formattedItems = items.map(item => ({
//       prices: {
//         price: item.sale_price,
//         originalPrice: item.mrp,
//         discount: item.discount
//       },
//       categories: [item.category_id?._id],
//       image: item.image,
//       tag: ["[\"shoe\",\"footwear\",\"apparel\"]"],
//       variants: item.item_attribute?.variant.map((variant, index) => ({
//         originalPrice: variant.price,
//         price: variant.selling_price,
//         quantity: variant.stock,
//         discount: item.vendor_discount,
//         productId: `${item._id}-${index}`,
//         barcode: "",
//         sku: "",
//         image: "",
//         ...(variant.groupArrSelections || {})
//       })) || [],
//       status: "show",
//       _id: item._id,
//       productId: item._id,
//       sku: "",
//       barcode: "",
//       title: { en: item.name },
//       description: { en: item.specification },
//       slug: item.name.toLowerCase().replace(/\s+/g, "-"),
//       category: item.category_id?._id,
//       stock: item.item_attribute?.variant.reduce((sum, v) => sum + Number(v.stock), 0) || 0,
//       isCombination: true,
//       createdAt: item.created_date,
//       updatedAt: item.modified_date,
//       sales: 0,
//       __v: item.__v
//     }));
//     return res.send(JSON.stringify(formattedItems, null, 2));
//   } catch (error) {
//     return res.status(500).json({ 
//       status: 'error',
//       message: 'Internal server error while retrieving items',
//       error: error.message
//     });
//   }
// };



exports.showItem = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('category_id item_group_id brand_id unit_id')
      .lean();

    const formattedItems = items.map(item => ({
      prices: {
        price: item.sale_price > 0 ? item.sale_price : (item.mrp ?? 0),
        originalPrice: item.mrp ?? 0,
        discount: item.discount ?? 0
      },
      categories: item.category_id?._id ? [item.category_id._id] : [], // Ensure no undefined values
      image: item.image ?? "",
      // tag: ["shoe", "footwear", "apparel"], // Ensure valid array
      tag: [
        "[\"shoe\",\"footwear\",\"apparel\"]"
      ],
      variants: (item.item_attribute?.variant ?? []).map((variant, index) => {
        const variantPrice = variant?.selling_price ?? variant?.price ?? 0;
        const variantOriginalPrice = variant?.price ?? item.mrp ?? 0;
        return ({
          originalPrice: variantOriginalPrice,
          price: variantPrice > 0 ? variantPrice : variantOriginalPrice,
          quantity: variant.stock ?? 0,
          discount: item.vendor_discount ?? 0,
          productId: `${item._id}-${index}`,
          barcode: variant.barcode ?? "",
          sku: variant.sku ?? "",
          image: variant.image ?? "",
          ...(variant.groupArrSelections ?? {}) // Ensure it's an object or empty
        })
      }),
      status: "show",
      _id: item._id ?? null, // Ensure no undefined values
      productId: item._id ?? null,
      sku: item.sku ?? "",
      barcode: item.barcode ?? "",
      title: { en: item.name ?? "" },
      description: { en: item.specification ?? "" },
      slug: item.name ? item.name.toLowerCase().replace(/\s+/g, "-") : "",
      category: item.category_id?._id ?? null, // Prevent undefined in JSON
      stock: item.stock || (item.item_attribute?.variant ?? []).reduce((sum, v) => sum + (Number(v.stock) || 0), 0),
      isCombination: true,
      createdAt: item.created_date ?? new Date(),
      updatedAt: item.modified_date ?? new Date(),
      sales: item.sales ?? 0,
      __v: item.__v ?? 0
    }));

    return res.json(formattedItems);
  } catch (error) {
    console.error("Error retrieving items:", error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while retrieving items',
      error: error.message
    });
  }
};

exports.getItemCode = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) throw new Error('Item not found in fetching item code');
    res.status(200).json({ item_code: item.item_code });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getItemDiscount = async (req, res) => {
  try {
    const { ItemCode, PartyCode } = req.body;
    if (!ItemCode || !PartyCode) {
      return res.status(400).json({ message: 'Item code and party code are required' });
    }
    const response = await axios.post(`${process.env.BUSY_API}/Item/GetItemDiscount`, {
      PartyCode: PartyCode,
      ItemCode: ItemCode
    });
    // console.log("Item Discount: ", response.data.Data);
    return res.json(response.data.Data);
  } catch (error) {
    console.error("Error retrieving item discount:", error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while retrieving item discount',
      error: error.message
    });
  }
};



// Dedicated stock sync endpoint
exports.syncStockData = async (req, res) => {
  try {
    console.log('🔄 Starting stock synchronization...');
    const response = await axios.post(`${process.env.BUSY_API}/Item/GetItem`);
    if (response.data.Data && response.data.Data.length > 0) {
      const items = response.data.Data;
      console.log(`📦 Syncing stock for ${items.length} items...`);
      let updatedCount = 0;
      let errorCount = 0;
      for (const item of items) {
        try {
          const stockValue = item.MainTransBal || 0;
          // Update item stock
          const result = await Item.findOneAndUpdate(
            { item_code: item.ItemCode },
            {
              stock: stockValue,
              'item_attribute.variant.0.stock': stockValue,
              modified_date: new Date()
            },
            { new: true }
          );

          if (result) {
            updatedCount++;
            console.log(`✅ Updated stock for ${item.ItemName}: ${stockValue}`);
          } else {
            console.log(`⚠️  Item not found: ${item.ItemName} (Code: ${item.ItemCode})`);
          }
        } catch (error) {
          errorCount++;
          console.error(`❌ Error updating stock for ${item.ItemName}:`, error.message);
        }
      }

      console.log(`🎉 Stock sync completed: ${updatedCount} updated, ${errorCount} errors`);
      res.status(200).json({
        message: 'Stock sync completed successfully',
        updated: updatedCount,
        errors: errorCount,
        total: items.length
      });
    } else {
      console.error('❌ API returned no stock data');
      res.status(400).json({ message: 'API returned no stock data' });
    }
  } catch (error) {
    console.error('❌ Error syncing stock data:', error.message);
    res.status(500).json({ message: 'Error syncing stock data', error: error.message });
  }
};

// Update stock by item_code
exports.updateStockByItemCode = async (req, res) => {
  try {
    const { item_code } = req.params;
    const { stock } = req.body;
    if (!item_code) {
      return res.status(400).json({ message: 'Item code is required' });
    }
    if (stock === undefined || stock === null) {
      return res.status(400).json({ message: 'Stock quantity is required' });
    }
    if (isNaN(Number(stock))) {
      return res.status(400).json({ message: 'Stock must be a valid number' });
    }
    const stockValue = Number(stock);
    // Find item by item_code
    const item = await Item.findOne({ item_code: Number(item_code) });
    if (!item) {
      return res.status(404).json({ message: 'Item not found with the provided item_code' });
    }

    // Update stock
    const updatedItem = await Item.findOneAndUpdate(
      { item_code: Number(item_code) },
      {
        stock: stockValue,
        modified_date: new Date()
      },
      { new: true, runValidators: true }
    );

    // Also update variant stock if item has variants
    // if (updatedItem.item_attribute?.variant && updatedItem.item_attribute.variant.length > 0) {
    //   await Item.findOneAndUpdate(
    //     { item_code: Number(item_code) },
    //     {
    //       'item_attribute.variant.$[].stock': stockValue,
    //       modified_date: new Date()
    //     },
    //     { new: true }
    //   );
    // }

    return res.status(200).json({
      message: 'Stock updated successfully',
      // item_code: updatedItem.item_code,
      // stock: updatedItem.stock
    });
  } catch (error) {
    console.error('Error updating stock by item_code:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating stock',
      error: error.message
    });
  }
};

// Get stock quantity by item_code (path parameter)
exports.getStockByItemCode = async (req, res) => {
  try {
    const { item_code } = req.params;

    if (!item_code) {
      return res.status(400).json({ message: 'Item code is required' });
    }

    // Find item by item_code
    const item = await Item.findOne({ item_code: Number(item_code) })
      .select('item_code name stock item_attribute.variant.stock')
      .lean();

    if (!item) {
      return res.status(404).json({ message: 'Item not found with the provided item_code' });
    }

    // Calculate total stock (main stock + variant stocks if available)
    let totalStock = item.stock || 0;

    if (item.item_attribute?.variant && Array.isArray(item.item_attribute.variant)) {
      const variantStock = item.item_attribute.variant.reduce((sum, v) => {
        return sum + (Number(v.stock) || 0);
      }, 0);
      // If variants have stock, use that; otherwise use main stock
      if (variantStock > 0) {
        totalStock = variantStock;
      }
    }

    return res.status(200).json({
      item_code: item.item_code,
      name: item.name,
      stock: totalStock,
      main_stock: item.stock || 0,
      variant_stock: item.item_attribute?.variant?.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 0
    });
  } catch (error) {
    console.error('Error getting stock by item_code:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while retrieving stock',
      error: error.message
    });
  }
};


exports.syncItemData = async (req, res) => {
  try {
    let items;
    if (req.body && req.body.Data) {
      items = req.body.Data;
    } else {
      const response = await axios.post(`${process.env.BUSY_API}/Item/GetItem`);

      if (!response.data?.Data || response.data.Data.length === 0) {
        console.error("API returned no data or invalid format");
        return res.status(400).json({ message: "API returned no data or invalid format" });
      }
      items = response.data.Data;
    }
    console.log(`Total items to sync: ${items.length}`);

    // Pre-fetch Color and Size attributes (Singular model uses name.en or title.en)
    let colorAttr = await Attribute.findOne({
      $or: [{ "name.en": /color/i }, { name: /color/i }]
    });
    let sizeAttr = await Attribute.findOne({
      $or: [{ "name.en": /size/i }, { name: /size/i }]
    });

    // Create or update attributes to ensure they have status: "show"
    if (!colorAttr) {
      colorAttr = await Attribute.create({
        name: { en: "Color" },
        title: { en: "Color" },
        option: "Dropdown",
        status: "show"
      });
    } else if (colorAttr.status !== "show") {
      colorAttr.status = "show";
      await colorAttr.save();
    }

    if (!sizeAttr) {
      sizeAttr = await Attribute.create({
        name: { en: "Size" },
        title: { en: "Size" },
        option: "Dropdown",
        status: "show"
      });
    } else if (sizeAttr.status !== "show") {
      sizeAttr.status = "show";
      await sizeAttr.save();
    }

    const getAttrValue = async (name, attr) => {
      if (!name || !attr) return null;
      const normalizedName = name.trim().toLowerCase();

      // Ensure variants array exists
      if (!attr.variants) attr.variants = [];

      // Singular model stores values in 'variants' array
      let variant = attr.variants.find(v =>
        (typeof v.name === 'string' && v.name.toLowerCase() === normalizedName) ||
        (v.name?.en?.toLowerCase() === normalizedName)
      );

      if (!variant) {
        const newId = new mongoose.Types.ObjectId();
        const newVariant = {
          _id: newId,
          name: { en: name.trim() },
          status: "show"
        };

        await Attribute.updateOne(
          { _id: attr._id },
          { $push: { variants: newVariant } }
        );

        // Update local object to avoid stale find() in next iteration
        attr.variants.push(newVariant);
        return newId;
      }
      return variant._id;
    };

    // Group items by ItemCode to handle variants, skip null codes
    const groupedItems = items.reduce((acc, item) => {
      const code = item.ItemCode;
      if (code === undefined || code === null) return acc;
      if (!acc[code]) acc[code] = [];
      acc[code].push(item);
      return acc;
    }, {});

    const uniqueItemCodes = Object.keys(groupedItems);
    console.log(`Total unique items to sync: ${uniqueItemCodes.length}`);

    const BATCH_SIZE = 100;

    for (let i = 0; i < uniqueItemCodes.length; i += BATCH_SIZE) {
      const batchCodes = uniqueItemCodes.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batchCodes.length} items)`);

      const promises = batchCodes.map(async (code) => {
        try {
          const itemEntries = groupedItems[code];
          const firstEntry = itemEntries[0];

          const itemGroup = await itemGroupModel.findOne({ code: firstEntry.ParentGrpCode });
          if (!itemGroup) {
            console.error(`❌ Item group not found for code: ${firstEntry.ParentGrpCode}`);
            return;
          }

          let categoryName = firstEntry.CategoryName || "General";
          let category = await CategoryModel.findOne({ name: categoryName });
          if (!category) {
            category = new CategoryModel({
              name: categoryName,
              description: 'Default category for items without one',
              is_active: true,
              status: 'show'
            });
            await category.save();
          }

          const unit = await UnitModel.findOne({ name: firstEntry.MainUnit });
          if (!unit) {
            console.error(`❌ Unit not found for name: ${firstEntry.MainUnit}`);
            return;
          }

          const existingItem = await Item.findOne({ item_code: code });
          let currentVariants = existingItem?.item_attribute?.variant ?
            existingItem.item_attribute.variant.map(v => v.toObject ? v.toObject() : v) : [];

          // Use a Map to deduplicate variants based on color and size
          const variantMap = new Map();
          const apiVariantKeys = new Set(); // To track variants found in current API batch

          // Initialize map with existing variants from DB
          currentVariants.forEach(v => {
            const vColor = v.color || v.groupArrSelections?.Color || "";
            const vSize = v.size || v.groupArrSelections?.Size || "";
            const key = `${vColor}-${vSize}`.toLowerCase().trim();
            variantMap.set(key, v);
          });

          // Process current API entries for this ItemCode
          for (const entry of itemEntries) {
            const color = entry.ItemColour || entry.ItemColor || "";
            const size = entry.ItemSize || "";

            // Only push to variant if color or size exists
            if (!color && !size) continue;

            const key = `${color}-${size}`.toLowerCase().trim();

            // Get attribute value IDs for groupArrSelections
            const groupArrSelections = {};
            if (color && colorAttr) {
              const colorValId = await getAttrValue(color, colorAttr);
              if (colorValId) groupArrSelections[colorAttr._id] = colorValId;
            }
            if (size && sizeAttr) {
              const sizeValId = await getAttrValue(size, sizeAttr);
              if (sizeValId) groupArrSelections[sizeAttr._id] = sizeValId;
            }

            const variantData = {
              ...(color && { color }),
              ...(size && { size }),
              stock: entry.MainTransBal || 0,
              price: entry.VendorPrice || 0,
              selling_price: entry.VendorPrice || 0,
              groupArrSelections
            };

            if (apiVariantKeys.has(key)) {
              // If multiple entries for SAME variant in SAME API batch, sum their stock
              const existing = variantMap.get(key);
              variantMap.set(key, {
                ...existing,
                ...variantData,
                stock: (existing.stock || 0) + (variantData.stock || 0)
              });
            } else {
              // First encounter in API for this variant, replace old DB data but keep extra fields (like attribute_image)
              const existing = variantMap.get(key);
              variantMap.set(key, { ...existing, ...variantData });
              apiVariantKeys.add(key);
            }
          }

          const finalVariants = Array.from(variantMap.values());
          const totalStock = finalVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

          // Prepare item_attribute by spreading existing to preserve fields like gst, offer, checkedItems
          const existingAttr = existingItem?.item_attribute ?
            (existingItem.item_attribute.toObject ? existingItem.item_attribute.toObject() : existingItem.item_attribute) : {};

          const itemData = {
            name: firstEntry.ItemName,
            alias: firstEntry.ItemAlias,
            hsn_code: firstEntry.HSNCode,
            sale_price: firstEntry.VendorPrice,
            mrp: firstEntry.CustomerPrice,
            item_code: code,
            item_group_id: itemGroup._id,
            category_id: category._id,
            unit_id: unit._id,
            alternate_unit: firstEntry.AltUnit,
            stock: totalStock,
            item_attribute: {
              ...existingAttr,
              variant: finalVariants,
              color: [...new Set(finalVariants.map(v => v.color).filter(Boolean))].join(', '),
              size: [...new Set(finalVariants.map(v => v.size).filter(Boolean))].join(', '),
              checkedItems: {
                ...(colorAttr && { [colorAttr._id]: true }),
                ...(sizeAttr && { [sizeAttr._id]: true })
              }
            },
            is_active: true,
            conversion_factor: firstEntry.ConFactor,
            modified_date: new Date()
          };

          // Preserve image if it already exists
          if (existingItem && existingItem.image && existingItem.image.length > 0) {
            itemData.image = existingItem.image;
          }

          await Item.findOneAndUpdate(
            { item_code: code },
            { $set: itemData },
            { upsert: true, new: true }
          );
        } catch (err) {
          console.error(`Error processing item ${code}: ${err.message}`);
        }
      });

      await Promise.all(promises);
    }

    console.log("✅ Item sync completed successfully");
    res.status(200).json({ message: "Item sync completed successfully" });

  } catch (error) {
    console.error("❌ Error syncing item data:", error.message);
    res.status(500).json({ message: "Error syncing item data", error: error.message });
  }
};


// exports.syncItemData = async (req, res) => {
//   try {
//     const response = await axios.post(`${process.env.BUSY_API}/Item/GetItem`);
//     if (response.data.Data && response.data.Data.length > 0) {
//       const items = response.data.Data;
//       console.log(`Syncing ${items.length} items...`);
//       for (const item of items) {
//         try {
//           const itemGroup = await itemGroupModel.findOne({ code: item.ParentGrpCode });
//           if (!itemGroup) {
//             console.error(`Item group not found for code: ${item.ParentGrpCode}`);
//             continue;
//           }
//           const category = await CategoryModel.findOne( { name: item.CategoryName });
//           if (!category) {
//             console.error(`Category not found for name: ${item.CategoryName}`);
//             continue;
//           }
//           const unit = await UnitModel.findOne({ name: item.MainUnit });
//           if (!unit) {
//             console.error(`Unit not found for name: ${item.MainUnit}`);
//             continue;
//           }
//           const itemData = {
//             name: item.ItemName,
//             alias: item.ItemAlias,
//             hsn_code: item.HSNCode,
//             sale_price: item.VendorPrice,
//             mrp: item.CustomerPrice,
//             item_code: item.ItemCode,
//             item_group_id: itemGroup._id,
//             category_id: category._id,
//             unit_id: unit._id,
//             alternate_unit: item.AltUnit,
//             // image: [],
//             // ✅ ADD STOCK MAPPING FROM MainTransBal
//             stock: item.MainTransBal || 0,
//             item_attribute: {
//               color: item.ItemColour,
//               size: item.ItemSize,
//               // ✅ ADD STOCK TO VARIANT AS WELL
//               variant: [{
//                 stock: item.MainTransBal || 0,
//                 price: item.VendorPrice || 0,
//                 selling_price: item.CustomerPrice || 0
//               }]
//             },
//             is_active: true,
//             conversion_factor:item.ConFactor
//           };
//           const existingItem = await Item.findOne({ item_code: item.ItemCode });
//           if (existingItem) {
//             await Item.findOneAndUpdate(
//               { item_code: item.ItemCode },
//               itemData,
//               { new: true }
//             );
//             // console.log(`Updated item: ${item.ItemName}`);
//           } else {
//             // Create new item
//             await Item.create(itemData);
//             // console.log(`Created new item: ${item.ItemName}`);
//           }
//         } catch (error) {
//           console.error(`Error processing item ${item.ItemName}:`, error.message);
//         }
//       }

//       console.log('Item sync completed successfully');
//       res.status(200).json({ message: 'Item sync completed successfully' });
//     } else {
//       console.error('API returned error status or no data');
//       res.status(400).json({ message: 'API returned error status or no data' });
//     }
//   } catch (error) {
//     console.log(" Error in syncing item at backend", error);
//     console.error('Error syncing item data:', error.message);
//     res.status(500).json({ message: 'Error syncing item data' });
//   }
// };

exports.importItems = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid input: expected an array of items." });
    }

    const BrandModel = require('../models/brand.model');
    const UnitModel = require('../models/Unit');
    const CategoryModel = require('../models/category.model');
    const ItemGroupModel = require('../models/itemGroup.model');
    const Item = require('../models/item.model');

    let importedCount = 0;
    let updatedCount = 0;

    for (const data of items) {
      if (!data.Product && !data.name) continue;
      const productName = data.Product || data.name;

      let unit_id = null;
      if (data.unit) {
        let unitDoc = await UnitModel.findOne({ name: { $regex: new RegExp(`^${data.unit}$`, 'i') } });
        if (!unitDoc) {
          unitDoc = new UnitModel({ name: data.unit, is_active: true });
          await unitDoc.save();
        }
        unit_id = unitDoc._id;
      }

      let brand_id = null;
      const brandName = data.brand || data.company;
      if (brandName) {
        let brandDoc = await BrandModel.findOne({ name: { $regex: new RegExp(`^${brandName}$`, 'i') } });
        if (!brandDoc) {
          brandDoc = new BrandModel({ name: brandName, is_active: true });
          await brandDoc.save();
        }
        brand_id = brandDoc._id;
      }

      let category_id = null;
      if (data.category) {
        let categoryDoc = await CategoryModel.findOne({ name: { $regex: new RegExp(`^${data.category}$`, 'i') } });
        if (!categoryDoc) {
          categoryDoc = new CategoryModel({ name: data.category, is_active: true });
          await categoryDoc.save();
        }
        category_id = categoryDoc._id;
      }

      let item_group_id = null;
      if (data.item_group) {
        let itemGroupDoc = await ItemGroupModel.findOne({ name: { $regex: new RegExp(`^${data.item_group}$`, 'i') } });
        if (!itemGroupDoc) {
          itemGroupDoc = new ItemGroupModel({ name: data.item_group, is_active: true, is_parent_group: false });
          await itemGroupDoc.save();
        }
        item_group_id = itemGroupDoc._id;
      }

      const updateData = {
        name: productName,
        sale_price: data.sale_price || data.Value ? Number(data.sale_price || data.Value) : 0,
        mrp: data.mrp || data.MRP ? Number(data.mrp || data.MRP) : 0,
        is_active: true,
      };

      if (data.alias) updateData.alias = data.alias;
      if (data.print_name) updateData.print_name = data.print_name;
      if (data.stock) updateData.stock = Number(data.stock);
      if (data.tax_gst) updateData.tax_gst = data.tax_gst;
      if (data.hsn_code) updateData.hsn_code = data.hsn_code;
      if (data.discount) updateData.discount = Number(data.discount);
      if (data.short_description) updateData.short_description = data.short_description;
      if (data.item_code) updateData.item_code = data.item_code; // Usually Number but depends on schema
      
      if (unit_id) updateData.unit_id = unit_id;
      if (brand_id) updateData.brand_id = brand_id;
      if (category_id) updateData.category_id = category_id;
      if (item_group_id) updateData.item_group_id = item_group_id;

      const existingItem = await Item.findOne({ name: productName });
      if (existingItem) {
        await Item.updateOne({ _id: existingItem._id }, { $set: updateData });
        updatedCount++;
      } else {
        const newItem = new Item(updateData);
        await newItem.save();
        importedCount++;
      }
    }

    return res.status(200).json({
      status: 'success',
      message: `Import successful. Created: ${importedCount}, Updated: ${updatedCount}`,
      importedCount,
      updatedCount
    });
  } catch (error) {
    console.error("Import Error:", error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while importing items',
      error: error.message
    });
  }
};