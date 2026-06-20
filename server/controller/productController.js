const Product = require("../models/Product");
const mongoose = require("mongoose");
const ItemGroup = require('../models/itemGroup.model');
const Category = require('../models/category.model');
const Category10 = require("../models/Category");
const Item = require('../models/item.model');
const { languageCodes } = require("../utils/data");
const SundryDiscount = require('../models/SundryDiscount.modal');
const ItemDiscount = require("../models/ItemDiscount.modal");

const addProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      // productId: cname + (count + 1),
      productId: req.body.productId
        ? req.body.productId
        : mongoose.Types.ObjectId(),
    });

    await newProduct.save();
    res.send(newProduct);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addAllProducts = async (req, res) => {
  try {
    // console.log('product data',req.body)
    await Product.deleteMany();
    await Product.insertMany(req.body);
    res.status(200).send({
      message: "Product Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShowingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "show" }).sort({ _id: -1 });
    res.send(products);
    // console.log("products", products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  const { title, category, price, page, limit } = req.query;

  let queryObject = {};
  let sortObject = {};
  if (title) {
    const escapedTitle = String(title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titleQueries = languageCodes.map((lang) => ({
      [`title.${lang}`]: { $regex: escapedTitle, $options: "i" },
    }));
    queryObject.$or = titleQueries;
  }

  if (price === "low") {
    sortObject = {
      "prices.originalPrice": 1,
    };
  } else if (price === "high") {
    sortObject = {
      "prices.originalPrice": -1,
    };
  } else if (price === "published") {
    queryObject.status = "show";
  } else if (price === "unPublished") {
    queryObject.status = "hide";
  } else if (price === "status-selling") {
    queryObject.stock = { $gte: 5 };
  } else if (price === "status-out-of-stock") {
    queryObject.stock = { $lt: 5 };
  } else if (price === "date-added-asc") {
    sortObject.createdAt = 1;
  } else if (price === "date-added-desc") {
    sortObject.createdAt = -1;
  } else if (price === "date-updated-asc") {
    sortObject.updatedAt = 1;
  } else if (price === "date-updated-desc") {
    sortObject.updatedAt = -1;
  } else {
    sortObject = { _id: -1 };
  }

  // console.log('sortObject', sortObject);

  if (category) {
    queryObject.categories = category;
  }

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" })
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      products,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    // console.log("error", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductBySlug = async (req, res) => {
  // console.log("slug", req.params.slug);
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: "category", select: "_id, name" })
      .populate({ path: "categories", select: "_id name" });

    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  // console.log('update product')
  // console.log('variant',req.body.variants)
  try {
    const product = await Product.findById(req.params.id);
    // console.log("product", product);

    if (product) {
      product.title = { ...product.title, ...req.body.title };
      product.description = {
        ...product.description,
        ...req.body.description,
      };

      product.productId = req.body.productId;
      product.sku = req.body.sku;
      product.barcode = req.body.barcode;
      product.slug = req.body.slug;
      product.categories = req.body.categories;
      product.category = req.body.category;
      product.show = req.body.show;
      product.isCombination = req.body.isCombination;
      product.variants = req.body.variants;
      product.stock = req.body.stock;
      product.prices = req.body.prices;
      product.image = req.body.image;
      product.tag = req.body.tag;

      await product.save();
      res.send({ data: product, message: "Product updated successfully!" });
    } else {
      res.status(404).send({
        message: "Product Not Found!",
      });
    }
  } catch (err) {
    res.status(404).send(err.message);
    // console.log('err',err)
  }
};

const updateManyProducts = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        // console.log('req.body[key]', typeof req.body[key]);
        updatedData[key] = req.body[key];
      }
    }

    // console.log("updated data", updatedData);

    await Product.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );
    res.send({
      message: "Products update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStatus = (req, res) => {
  const newStatus = req.body.status;
  Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: `Product ${newStatus} Successfully!`,
        });
      }
    }
  );
};

const deleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Product Deleted Successfully!",
      });
    }
  });
};

const getShowingStoreProducts = async (req, res) => {
  try {
    const baseUrl = (process.env.BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, "");
    const { category, itemgroup, title, slug, query, userCode, group_type, itemgroupIds } = req.query;
    let vendorDiscount = 0;
    let categoryQuery = { is_active: true };

    // Build base filter for category
    const actualCategory = category && category !== 'multi' ? category : req.query._id;
    if (actualCategory) {
      const ids = actualCategory.split(',').filter(id => id && id !== 'multi' && id !== 'undefined');
      if (ids.length > 0) {
        const categories = await Category.find({
          $or: [
            { _id: { $in: ids } },
            { parent_id: { $in: ids } }
          ]
        });
        const allCategoryIds = categories.map(cat => cat._id.toString());
        const finalCategoryIds = Array.from(new Set([...ids, ...allCategoryIds]));
        categoryQuery.category_id = { $in: finalCategoryIds };
      }
    }

    // Support both 'itemgroup' (original) and 'itemgroupIds' (newly added in frontend)
    const actualItemGroup = itemgroup && itemgroup !== 'multi' ? itemgroup : itemgroupIds;
    if (actualItemGroup) {
      const ids = actualItemGroup.split(',').filter(id => id && id !== 'multi' && id !== 'undefined');
      if (ids.length > 0) {
        const itemGroups = await ItemGroup.find({
          $or: [
            { _id: { $in: ids } },
            { parent_id: { $in: ids } }
          ]
        });
        const allItemGroupIds = itemGroups.map(ig => ig._id.toString());
        const finalItemGroupIds = Array.from(new Set([...ids, ...allItemGroupIds]));
        categoryQuery.item_group_id = { $in: finalItemGroupIds };
      }
    }

    // Implement comprehensive fuzzy search pattern
    if (query && String(query).trim().length > 0) {
      const search = String(query).trim();
      // Escape special characters for regex
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Create fuzzy search pattern that allows optional spaces between characters
      const fuzzyPattern = search.split('').map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*');

      // First, find matching categories and item_groups by name
      const matchingCategories = await Category.find({
        $or: [
          { name: { $regex: escapedSearch, $options: 'i' } },
          { name: { $regex: fuzzyPattern, $options: 'i' } }
        ]
      }).select('_id').lean();

      const matchingItemGroups = await ItemGroup.find({
        $or: [
          { name: { $regex: escapedSearch, $options: 'i' } },
          { name: { $regex: fuzzyPattern, $options: 'i' } }
        ]
      }).select('_id').lean();

      const matchingCategoryIds = matchingCategories.map(cat => cat._id);
      const matchingItemGroupIds = matchingItemGroups.map(ig => ig._id);

      // Build comprehensive search query
      const orQuery = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { name: { $regex: fuzzyPattern, $options: 'i' } },
        { alias: { $regex: escapedSearch, $options: 'i' } },
        { alias: { $regex: fuzzyPattern, $options: 'i' } },
        { print_name: { $regex: escapedSearch, $options: 'i' } },
        { print_name: { $regex: fuzzyPattern, $options: 'i' } },
        { specification: { $regex: escapedSearch, $options: 'i' } },
        { specification: { $regex: fuzzyPattern, $options: 'i' } },
        { short_description: { $regex: escapedSearch, $options: 'i' } },
        { short_description: { $regex: fuzzyPattern, $options: 'i' } },
        { long_description: { $regex: escapedSearch, $options: 'i' } },
        { long_description: { $regex: fuzzyPattern, $options: 'i' } },
        { hsn_code: { $regex: escapedSearch, $options: 'i' } },
        { hsn_code: { $regex: fuzzyPattern, $options: 'i' } },
        { sku: { $regex: escapedSearch, $options: 'i' } },
        { sku: { $regex: fuzzyPattern, $options: 'i' } },
        { barcode: { $regex: escapedSearch, $options: 'i' } },
        { barcode: { $regex: fuzzyPattern, $options: 'i' } },
      ];

      // Add category and item_group ID matches if found
      if (matchingCategoryIds.length > 0) {
        orQuery.push({ category_id: { $in: matchingCategoryIds } });
      }
      if (matchingItemGroupIds.length > 0) {
        orQuery.push({ item_group_id: { $in: matchingItemGroupIds } });
      }

      // If query is a number, also try to match item_code, mrp, sale_price
      const queryNum = Number(search);
      if (!Number.isNaN(queryNum)) {
        orQuery.push({ item_code: queryNum });
        orQuery.push({ mrp: queryNum });
        orQuery.push({ sale_price: queryNum });
      }

      // Add $or condition to categoryQuery
      categoryQuery.$or = orQuery;
    }
    // Handle slug-based product lookup
    if (slug) {

      const items = await Item.find({ stock: { $gte: 5 }, is_active: true }).populate('category_id item_group_id brand_id unit_id').lean();
      const formattedItems = await Promise.all(
        items.map(async (item) => {
          // Calculate vendor-specific pricing for slug-based lookup
          const basePrice = item.sale_price ?? 0;
          const originalPrice = item.mrp ?? 0;
          const itemDiscount = item.discount ?? 0;
          const itemCode = item.item_code;
          let vendorDiscount = 0;

          if (itemCode && req.query?.session) {
            const sessionNum = Number(req.query.session);
            if (!isNaN(sessionNum)) {
              const getItemDiscount = await ItemDiscount.findOne({
                partyCode: sessionNum,
                itemCode: itemCode,
              }).lean();

              vendorDiscount = getItemDiscount?.discount1 ?? 0;
            }
          }

          // Apply vendor discount if available, otherwise use sale_price
          const finalPrice =
            basePrice > 0
              ? vendorDiscount > 0
                ? basePrice - (basePrice * vendorDiscount) / 100
                : basePrice
              : originalPrice;

          return {
            prices: {
              price: finalPrice,
              originalPrice: basePrice,
              vendorPrice: finalPrice,
              customerPrice: originalPrice,
              discount: vendorDiscount > 0 ? vendorDiscount : itemDiscount,
            },
            categories: item.category_id?._id ? [item.category_id._id] : [],
            image: (() => {
              const rawImages = Array.isArray(item.image)
                ? item.image
                : item.image
                  ? [item.image]
                  : [];

              const normalized = rawImages
                .map((img) => {
                  if (!img) return null;
                  if (typeof img === "string") {
                    const pathOnly = img.startsWith("/") ? img : `/${img}`;
                    return `${baseUrl}${pathOnly}`;
                  }
                  if (typeof img === "object") {
                    const candidate = img.url || img.path || img.filePath || "";
                    if (!candidate) return null;
                    const pathOnly = candidate.startsWith("/")
                      ? candidate
                      : `/${candidate}`;
                    return `${baseUrl}${pathOnly}`;
                  }
                  return null;
                })
                .filter(Boolean);

              if (normalized.length) return normalized;

              const placeholder =
                process.env.DEFAULT_PLACEHOLDER_IMAGE ||
                "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";
              return [placeholder];
            })(),
            moq: item.item_group_id?.moq ?? 6,
            item_group_id: item.item_group_id?._id,
            unit_id: item.unit_id?._id,
            tag: [],
            variants: (item.item_attribute?.variant ?? []).map((variant, index) => {
              const variantPrice = variant?.selling_price ?? variant?.price ?? 0;
              const variantOriginalPrice = variant?.price ?? item.mrp ?? 0;
              return {
                originalPrice: variantOriginalPrice,
                price: variantPrice > 0 ? variantPrice : variantOriginalPrice,
                quantity: variant?.stock ?? 0,
                discount: item?.vendor_discount ?? 0,
                productId: `${item?._id}-${index}`,
                barcode: variant?.barcode ?? "",
                sku: variant?.sku ?? "",
                image:
                  Array.isArray(variant?.attribute_image) &&
                    variant.attribute_image[0]
                    ? `${baseUrl}/${variant.attribute_image[0]}`
                    : "",
                ...(variant?.groupArrSelections ?? {}),
              };
            }),
            status: "show",
            _id: item._id ?? null,
            productId: item._id ?? null,
            sku: item.sku ?? "",
            barcode: item.barcode ?? "",
            title: { en: item.name ?? "" },
            description: {
              en:
                (item.short_description ? item.short_description + " " : "") +
                (item.long_description ? item.long_description + " " : "") +
                (item.specification ?? ""),
            },
            slug: item.name
              ? item.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
              : "",
            category: item.category_id?._id ?? null,
            stock: (item.item_attribute?.variant ?? []).reduce(
              (sum, v) => sum + (Number(v.stock) || 0),
              0
            ),
            isCombination: group_type === "Vendor" ? true : false,
            createdAt: item.created_date ?? new Date(),
            updatedAt: item.modified_date ?? new Date(),
            sales: item.sales ?? 0,
            conversion_factor: item.conversion_factor ?? 1,
            item_attribute: item.item_attribute,
            __v: item.__v ?? 0,
          };
        })
      );


      const product = formattedItems.find(p => p.slug === slug);

      if (product) {
        // Find related products from same category
        const relatedProducts = formattedItems.filter(p =>
          p.category === product.category && p._id !== product._id
        ).slice(0, 10);

        return res.send({
          products: [product],
          popularProducts: [],
          relatedProducts: relatedProducts,
          discountedProducts: [],
        });
      } else {
        console.log("Product not found for slug:", slug);
        return res.status(404).send({
          message: "Product not found",
          products: [],
          popularProducts: [],
          relatedProducts: [],
          discountedProducts: [],
        });
      }
    }

    // Pagination
    const pages = Number(req.query.page) || 1;
    const limits = Number(req.query.limit) || 18;
    const skip = (pages - 1) * limits;

    // Find items with base query (category/itemgroup filters + search)
    categoryQuery.stock = { $gte: 5 };
    const totalDoc = await Item.countDocuments(categoryQuery);
    const items = await Item.find(categoryQuery)
      .populate('category_id item_group_id brand_id unit_id')
      .skip(skip)
      .limit(limits)
      .lean();

    const formattedItems = await Promise.all(
      items.map(async (item) => {
        // Calculate vendor-specific pricing
        const basePrice = item.sale_price ?? 0;
        const originalPrice = item.mrp ?? 0;
        const itemDiscount = item.discount ?? 0;
        const itemCode = item.item_code;

        if (itemCode && req.query?.session) {
          const sessionNum = Number(req.query.session);
          if (!isNaN(sessionNum)) {
            const getItemDiscount = await ItemDiscount.findOne({
              partyCode: sessionNum,
              itemCode: itemCode,
            });
            vendorDiscount = getItemDiscount?.discount1;
          }
        }
        const finalPrice = basePrice > 0 ? vendorDiscount > 0
          ? basePrice - (basePrice * vendorDiscount) / 100
          : basePrice
          : basePrice;



        const product = {
          prices: {
            price: finalPrice,
            originalPrice: basePrice,
            vendorPrice: finalPrice,
            customerPrice: originalPrice,
            discount: vendorDiscount > 0 ? vendorDiscount : itemDiscount,
          },
          categories: item.category_id?._id ? [item.category_id._id] : [],
          image: (() => {
            const rawImages = Array.isArray(item.image)
              ? item.image
              : item.image
                ? [item.image]
                : [];

            const normalized = rawImages
              .map((img) => {
                if (!img) return null;
                if (typeof img === "string") {
                  const pathOnly = img.startsWith("/") ? img : `/${img}`;
                  return `${baseUrl}${pathOnly}`;
                }
                if (typeof img === "object") {
                  const candidate = img.url || img.path || img.filePath || "";
                  if (!candidate) return null;
                  const pathOnly = candidate.startsWith("/")
                    ? candidate
                    : `/${candidate}`;
                  return `${baseUrl}${pathOnly}`;
                }
                return null;
              })
              .filter(Boolean);

            if (normalized.length) return normalized;

            const placeholder =
              process.env.DEFAULT_PLACEHOLDER_IMAGE ||
              "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";
            return [placeholder];
          })(),
          moq: item.item_group_id?.moq ?? 6,
          tag: [],
          variants: (item.item_attribute?.variant ?? []).map((variant, index) => {
            const variantPrice = variant?.selling_price ?? variant?.price ?? 0;
            const variantOriginalPrice = variant?.price ?? item.mrp ?? 0;

            return {
              originalPrice: variantOriginalPrice,
              price: variantPrice > 0 ? variantPrice : variantOriginalPrice,
              quantity: variant?.stock ?? 0,
              discount: item?.vendor_discount ?? 0,
              productId: `${item?._id}-${index}`,
              barcode: variant?.barcode ?? "",
              sku: variant?.sku ?? "",
              image: Array.isArray(variant?.attribute_image) && variant.attribute_image[0]
                ? `${baseUrl}/${variant.attribute_image[0]}`
                : "",
              ...(variant?.groupArrSelections ?? {}),
            };
          }),
          item_group_id: item.item_group_id?._id,
          unit_id: item.unit_id?._id,
          status: "show",
          _id: item._id ?? null,
          productId: item._id ?? null,
          sku: item.sku ?? "",
          barcode: item.barcode ?? "",
          title: { en: item.name ?? "" },
          description: {
            en:
              (item.short_description ? item.short_description + " " : "") +
              (item.long_description ? item.long_description + " " : "") +
              (item.specification ?? ""),
          },
          slug: item.name
            ? item.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
            : "",
          category: item.category_id?._id ?? null,
          stock:
            item.stock ||
            (item.item_attribute?.variant ?? []).reduce(
              (sum, v) => sum + (Number(v.stock) || 0),
              0
            ),
          isCombination: true,
          createdAt: item.created_date ?? new Date(),
          updatedAt: item.modified_date ?? new Date(),
          sales: item.sales ?? 0,
          conversion_factor: item.conversion_factor ?? 1,
          item_attribute: item.item_attribute,
          __v: item.__v ?? 0,
        };
        return product;
      })
    );

    res.send({
      products: formattedItems,
      popularProducts: formattedItems.filter(item => item.prices.discount == 0),
      relatedProducts: formattedItems,
      discountedProducts: formattedItems.filter(item => item.prices.discount > 0),
      totalDoc,
      pages: Math.ceil(totalDoc / limits),
      page: pages,
      limit: limits
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message,
    });
  }

};

const deleteManyProducts = async (req, res) => {
  try {
    const cname = req.cname;
    // console.log("deleteMany", cname, req.body.ids);

    await Product.deleteMany({ _id: req.body.ids });

    res.send({
      message: `Products Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get search suggestions for autocomplete
const getSearchSuggestions = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    console.log("query1111", query);

    if (!query || String(query).trim().length < 2) {
      return res.send({
        suggestions: [],
        categories: [],
        itemGroups: []
      });
    }

    const search = String(query).trim();
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const fuzzyPattern = search.split('').map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*');
    const suggestionLimit = Math.min(parseInt(limit) || 10, 20);

    // Find matching categories
    const matchingCategories = await Category.find({
      $or: [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { name: { $regex: fuzzyPattern, $options: 'i' } }
      ],
      is_active: true
    })
      .select('_id name')
      .limit(5)
      .lean();

    // Find matching item groups
    const matchingItemGroups = await ItemGroup.find({
      $or: [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { name: { $regex: fuzzyPattern, $options: 'i' } }
      ],
      is_active: true
    })
      .select('_id name')
      .limit(5)
      .lean();

    // Find matching items (limited results for suggestions)
    const matchingItems = await Item.find({
      $or: [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { name: { $regex: fuzzyPattern, $options: 'i' } },
        { alias: { $regex: escapedSearch, $options: 'i' } },
        { alias: { $regex: fuzzyPattern, $options: 'i' } },
        { print_name: { $regex: escapedSearch, $options: 'i' } },
        { print_name: { $regex: fuzzyPattern, $options: 'i' } }
      ],
      is_active: true,
      stock: { $gte: 5 }
    })
      .select('_id name alias print_name')
      .limit(suggestionLimit)
      .lean();

    // Format suggestions
    const suggestions = matchingItems.map(item => ({
      id: item._id,
      name: item.name || item.print_name || item.alias || '',
      type: 'product'
    }));

    const categories = matchingCategories.map(cat => ({
      id: cat._id,
      name: cat.name,
      type: 'category'
    }));

    const itemGroups = matchingItemGroups.map(ig => ({
      id: ig._id,
      name: ig.name,
      type: 'itemGroup'
    }));

    res.send({
      suggestions,
      categories,
      itemGroups
    });
  } catch (err) {
    console.error("Error in getSearchSuggestions:", err);
    res.status(500).send({
      message: err.message,
      suggestions: [],
      categories: [],
      itemGroups: []
    });
  }
};

module.exports = {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
  getSearchSuggestions,
};
