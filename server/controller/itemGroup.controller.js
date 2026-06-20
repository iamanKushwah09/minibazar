const ItemGroup = require('../models/itemGroup.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const fileUploadHelper = require('../fileUploader/fileUploadHelper');
const { pathToBase64 } = require('../common/folderToBase64');
const axios = require('axios');


// Create a new item group
exports.createItemGroup = async (req, res) => {
  try {
    const images = req.body.image; 
    if (!Array.isArray(images)) {
      return res.status(400).json({ message: "Invalid input: `image` should be an array." });
    }
    const uploadedPaths = await Promise.all(
      images
        .filter((image) => image.base64File && image.fileName) 
        .map(async (image) => {
          const { base64File, fileName } = image;
          const cleanedBase64File = base64File.split(';base64,').pop();
          return await fileUploadHelper.uploadSingleFile(`itemgroup`, fileName, cleanedBase64File);
        })
    );
    req.body.image = uploadedPaths.length > 0 ? uploadedPaths[0] : "";

    if (typeof req.body.moq === "undefined" || req.body.moq === null || req.body.moq === "" || req.body.moq === 0) {
      req.body.moq = 6; 
    }

    const newItemGroup = new ItemGroup(req.body);
    const savedItemGroup = await newItemGroup.save();
    res.status(201).json({ message: `Item group ${CREATE_MESSAGE}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get item group by ID
exports.getItemGroupById = async (req, res) => {
  try {
    const itemGroup = await ItemGroup.findById(req.params.id);
    const itemGroupWithImage = {
      ...itemGroup.toObject(),
      base64File: itemGroup.image ? `data:image/png;base64,${pathToBase64(`${process.cwd()}/uploadFile_masale${itemGroup.image}`).base64File}` : '',
      fileName: typeof itemGroup.image === 'string' ? itemGroup.image.split('/').pop() : '',
      url: itemGroup.image ? `${process.env.BASE_URL}${itemGroup.image}` : ''
    };
    if (!itemGroup) throw new Error('Item group not found');
    res.status(200).json(itemGroupWithImage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an item group by ID
exports.updateItemGroupById = async (req, res) => {
  try {
    const images = req.body.image;
    if (Array.isArray(images) && images.length > 0) {
      const uploadedPaths = await Promise.all(
        images.map(async (image) => {
          if (image.base64File && image.fileName) {
            const { base64File, fileName } = image;
            const cleanedBase64File = base64File.split(';base64,').pop();
            return await fileUploadHelper.uploadSingleFile(`itemgroup`, fileName, cleanedBase64File);
          }
          if (image.url) {
            return image.url.replace(process.env.BASE_URL, '');
          }
          if (typeof image === 'string') return image;
          return '';
        })
      );
      const finalImage = uploadedPaths.find(p => p !== '');
      req.body.image = finalImage || "";
    } else if (!req.body.image) {
      delete req.body.image;
    }

    const updatedItemGroup = await ItemGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItemGroup) throw new Error('Item group not found');
    res.status(200).json({ message: `Item group ${UPDATE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an item group by ID
exports.deleteItemGroupById = async (req, res) => {
  try {
    const deletedItemGroup = await ItemGroup.findByIdAndDelete(req.params.id);
    if (!deletedItemGroup) throw new Error('Item group not found');
    res.status(200).json({ message: `Item group ${DELETE_MESSAGE}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all itemGroups
exports.deleteAllItemGroups = async (req, res) => {
  try {
    const deletedItemGroups = await ItemGroup.deleteMany({});
    return res.status(200).json({
      status: 'success',
      message: `${deletedItemGroups.deletedCount} itemGroups deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting itemGroups',
      error: error.message
    });
  }
};

exports.getAllItemGroups = async (req, res) => {
  try {
    const { page, limit, q } = req.query;
    if ((page && Number(page) > 0) || (limit && Number(limit) > 0) || (q && String(q).trim().length > 0)) {
      const currentPage = Math.max(1, Number(page) || 1);
      const perPage = Math.max(1, Math.min(100, Number(limit) || 10));
      const skip = (currentPage - 1) * perPage;
      const query = {};
      if (q && String(q).trim().length > 0) {
        const search = String(q).trim();
        const orQuery = [
          { name: { $regex: search, $options: 'i' } },
          { alias: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
        ];
        const qNum = Number(search);
        if (!Number.isNaN(qNum)) {
          orQuery.push({ code: qNum.toString() });
          orQuery.push({ moq: qNum });
          orQuery.push({ discount: qNum });
        }
        query.$or = orQuery;
      }

      const totalDoc = await ItemGroup.countDocuments(query);
      const itemGroups = await ItemGroup.find(query)
        .populate({
          path: 'parent_id',
          select: 'name', 
        })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();
      const resultWithAlias = itemGroups.map(item => ({
        ...item,
        parent_name: item.parent_id ? item.parent_id.name : null, 
        parent_id: undefined 
      }));

      return res.status(200).json({
        itemGroups: resultWithAlias,
        totalDoc,
        limits: perPage,
        pages: currentPage,
      });
    }
    const itemGroups = await ItemGroup.find()
      .sort({ _id: -1 })
      .populate({
        path: 'parent_id',
        select: 'name', 
      })
      .lean(); 
    const resultWithAlias = itemGroups.map(item => ({
      ...item,
      parent_name: item.parent_id ? item.parent_id.name : null, 
      parent_id: undefined 
    }));

    return res.status(200).json(resultWithAlias);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while retrieving item groups',
      error: error.message
    });
  }
};

// Updated activeItemGroups to return a hierarchical structure (tree)
exports.activeItemGroups = async (req, res) => {
  try {
    const itemGroups = await ItemGroup.find({ is_active: true }).lean();
    
    const buildHierarchy = (parentId = null) => {
      return itemGroups
        .filter(group => {
          if (parentId === null) {
            return !group.parent_id;
          }
          return group.parent_id && group.parent_id.toString() === parentId.toString();
        })
        .map(group => ({
          _id: group._id,
          name: group.name,
          image: group.image,
          children: buildHierarchy(group._id)
        }));
    };

    const structuredData = buildHierarchy(null);
    res.status(200).json(structuredData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.syncItemGroupData = async (req, res) => {
  try {
    let Data;
    if (req.body && req.body.Data) {
      Data = req.body.Data;
    } else {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.BUSY_API}/Item/GetItemGroup`,
        headers: {},
        timeout: 10000
      };
      const response = await axios.request(config);
      Data = response.data.Data;
    }
    if (!Array.isArray(Data) || Data.length === 0) {
      return res.status(404).json({ message: 'No data received from Busy Item Group API' });
    }
    for (const item of Data) {
      const {
        ParentGrpCode,
        ParentGrpName,
        ItemGroupCode,
        ItemGroupName,
        Image,
        Alias,
        Discount
      } = item;

      let parent_id = null;

      if (ParentGrpCode && ParentGrpCode != 0 && ParentGrpCode != "0") {
        const parentGroup = await ItemGroup.findOneAndUpdate(
          { code: String(ParentGrpCode) },
          {
            $set: {
              name: ParentGrpName,
              is_active: true,
              is_parent_group: true,
              modified_date: new Date()
            },
            $setOnInsert: {
              is_primary: false,
              alias: null,
              discount: null,
            }
          },
          { upsert: true, new: true }
        );
        parent_id = parentGroup?._id;
      }

      if (ItemGroupCode && ItemGroupName) {
        await ItemGroup.findOneAndUpdate(
          { code: String(ItemGroupCode) },
          {
            $set: {
              name: ItemGroupName,
              parent_id: parent_id,
              is_active: true,
              is_primary: (ParentGrpCode == 0 || ParentGrpCode == "0"),
              modified_date: new Date()
            },
            $setOnInsert: {
              is_parent_group: false,
              alias: Alias || null,
              discount: Discount || null,
            }
          },
          { upsert: true }
        );
      }
    }

    res.status(200).json({
      message: "Item groups refreshed successfully"
    });

  } catch (error) {
    console.error(error);
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ message: 'Request timeout - API took too long to respond' });
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
