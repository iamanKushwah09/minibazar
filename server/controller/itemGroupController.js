const ItemGroupSchema = require('../models/itemGroup.model');

const getShowingCategory = async (req, res) => {
  try {
    const itemGroups = await ItemGroupSchema.find({ is_active: true }); // boolean, not "true" string

    let itemGroupMap = {};

    // First: Map all categories by ID
    itemGroups.forEach(category => {
      const id = category._id.toString();
      const parentId = category.parent_id ? category.parent_id.toString() : null;

      itemGroupMap[id] = {
        _id: id,
        name: { en: category.name },
        description: { en: category.description || '' },
        status: category.status || 'show',
        icon: category.image
          ? `${process.env.BASE_URL}${category.image}`
          : "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
        parentId: parentId,
        parentName: null, // to be filled later
        children: []
      };
    });

    // Second: Add parentName and build hierarchy
    const structuredData = [];

    Object.values(itemGroupMap).forEach(category => {
      if (category.parentId && itemGroupMap[category.parentId]) {
        // Set parent name
        category.parentName = itemGroupMap[category.parentId].name.en;

        // Push into parent's children array
        itemGroupMap[category.parentId].children.push(category);
      } else {
        // Top-level category
        category.parentName = category.name.en;
        structuredData.push(category);
      }
    });

    // Final structure with a single "Home" root if needed
    const response = [{
      _id: "62c827b5a427b63741da9175",
      name: { en: "Home" },
      parentName: "Home",
      description: { en: "This is Home Category" },
      status: "show",
      children: structuredData
    }];

    res.send(response);

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { getShowingCategory };
