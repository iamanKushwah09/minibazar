// const Category = require("../models/Category");
const Category = require('../models/category.model');
const logger = require('../log');
const axios = require('axios');

// // // Log some messages
// logger.info('This is an info message');
// logger.warn('This is a warning message');
// logger.error('This is an error message');

const addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).send({
      message: "Category Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// all multiple category
const addAllCategory = async (req, res) => {
  try {
    await Category.deleteMany();
    await Category.insertMany(req.body);
    res.status(200).send({
      message: "Category Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get status show category
const getShowingCategory = async (req, res) => {
  try {

    const categories = await Category.find({ status: "show" });
    let categoryMap = {};
    categories.forEach(category => {
      categoryMap[category._id.toString()] = {
        _id: category._id.toString(),
        name: { en: category.name },
        description: { en: category.description },
        status: category.status,
        icon: category.image ? `${process.env.BASE_URL}${category.image}` : "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
        parentId: category.parent_id ? category.parent_id.toString() : null,
        parentName: category.parent_id ? categories.find(cat => cat._id.toString() === category.parent_id.toString()).name : null,
        children: []
      };
    });

    // ✅ Step 3: Build the hierarchical structure
    let structuredData = [];
    categories.forEach(category => {
      if (category.parent_id) {
        let parentId = category.parent_id.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryMap[category._id.toString()]);
        }
      } else {
        structuredData.push(categoryMap[category._id.toString()]);
      }
    });

    let obj = [{
      "_id": "62c827b5a427b63741da9175",
      "name": {
        "en": "Home"
      },
      "parentName": "Home",
      "description": {
        "en": "This is Home Category"
      },
      "status": "show",
      "children": structuredData
    }]

    res.send(obj);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const getShowingCategory = async (req, res) => {
//   try {
//     const categories = await Category.find({ status: "show" });
//     let categoryMap = {};
//     categories.forEach(category => {
//       categoryMap[category._id.toString()] = {
//         _id: category._id.toString(),
//         name: { en: category.name },
//         description: { en: category.description },
//         status: category.status,
//         parentId: category.parent_id ? category.parent_id.toString() : null,
//         // icon:"",
//         parentName: category.parent_id
//           ? categories.find(cat => cat._id.toString() === category.parent_id.toString()).name
//           : null,
//         children: []  // Initialize empty children array
//       };
//     });

//     const buildHierarchy = (parentId = null) => {
//       return categories
//         .filter(category => category.parent_id && category.parent_id.toString() === parentId)
//         .map(category => {
//           const categoryData = categoryMap[category._id.toString()];
//           categoryData.children = buildHierarchy(category._id.toString());
//           return categoryData;
//         });
//     };
//     let structuredData = buildHierarchy(null);
//     res.json(structuredData);
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };



// const categoryList = readyToParentAndChildrenCategory(categories);
// console.log("category list", categoryList.length);

// get all category parent and child
const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    const categoryList = readyToParentAndChildrenCategory(categories);
    //  console.log('categoryList',categoryList)
    res.send(categoryList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    res.send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// category update
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = { ...category.name, ...req.body.name };
      category.description = {
        ...category.description,
        ...req.body.description,
      };
      category.icon = req.body.icon;
      category.status = req.body.status;
      category.parentId = req.body.parentId
        ? req.body.parentId
        : category.parentId;
      category.parentName = req.body.parentName;

      await category.save();
      res.send({ message: "Category Updated Successfully!" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// udpate many category
const updateManyCategory = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        updatedData[key] = req.body[key];
      }
    }

    await Category.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Categories update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// category update status
const updateStatus = async (req, res) => {
  // console.log('update status')
  try {
    const newStatus = req.body.status;

    await Category.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Category ${newStatus === "show" ? "Published" : "Un-Published"
        } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
//single category delete
const deleteCategory = async (req, res) => {
  try {
    console.log("id cat >>", req.params.id);
    await Category.deleteOne({ _id: req.params.id });
    await Category.deleteMany({ parentId: req.params.id });
    res.status(200).send({
      message: "Category Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

  //This is for delete children category
  // Category.updateOne(
  //   { _id: req.params.id },
  //   {
  //     $pull: { children: req.body.title },
  //   },
  //   (err) => {
  //     if (err) {
  //       res.status(500).send({ message: err.message });
  //     } else {
  //       res.status(200).send({
  //         message: 'Category Deleted Successfully!',
  //       });
  //     }
  //   }
  // );
};

// all multiple category delete
const deleteManyCategory = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    await Category.deleteMany({ parentId: req.body.ids });
    await Category.deleteMany({ _id: req.body.ids });

    res.status(200).send({
      message: "Categories Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const readyToParentAndChildrenCategory = (categories, parent_id = null) => {
  const categoryList = [];
  let Categories;
  if (parent_id == null) {
    Categories = categories.filter((cat) => cat.parent_id == undefined);
  } else {
    Categories = categories.filter((cat) => cat.parent_id == parent_id);
    console.log(parent_id)
  }

  for (let cate of Categories) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parent_id,
      parentName: cate.name,
      description: cate.description,
      icon: "",
      status: cate.status,
      children: readyToParentAndChildrenCategory(categories, cate._id),
    });
  }

  return categoryList;
};

// sync category
const syncCategory = async (req, res) => {
  try {
    let Data;
    if (req.body && req.body.Data) {
      Data = req.body.Data;
    } else {
      const config = {
        method: 'post',
        url: `${process.env.BUSY_API}/item/GetItemCategory`,
        timeout: 5000
      };
      const response = await axios.request(config);
      Data = response.data.Data;
    }

    if (!Data || Data.length === 0) {
      return res.status(404).json({ message: 'No data received from Busy Item Category API' });
    }

    for (const { Code, Name } of Data) {
      if (!Name || !Code) continue;

      // Check if this category already exists
      const existingCategory = await Category.findOne({
        name: Name
      });

      if (existingCategory) {
        // If found, update it
        existingCategory.name = Name;
        existingCategory.status = 'show';
        existingCategory.is_active = true;
        await existingCategory.save();
      } else {
        // If not found, create it
        const newCategory = new Category({
          name: Name,
          description: '',
          is_active: true,
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

module.exports = {
  addCategory,
  addAllCategory,
  getAllCategory,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  getAllCategories,
  updateManyCategory,
  syncCategory,
};
