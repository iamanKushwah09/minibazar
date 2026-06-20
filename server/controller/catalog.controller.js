const Catalog = require('../models/catalog.model');
const env = require('dotenv');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const fileUploadHelper = require('../fileUploader/fileUploadHelper');
const Item = require('../models/item.model');
const ItemGroup = require('../models/itemGroup.model');
const Category = require('../models/category.model');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { pathToBase64 } = require('../common/folderToBase64');
env.config();

const uri = process.env.BASE_URL || 'https://api.selectionfootwear.com';


// Create new Customer
exports.createCatalog = async (req, res) => {
    try {
        const { category_id, item_group_id, stock_quantity, sale_price, stock_quantity_operator, sale_price_operator } = req.body;
        // const { base64File, fileName } = req.body.image ?? {};
        // let uploadPath = ""
        // if (base64File) {
        //     const cleanedBase64File = base64File.split(';base64,').pop();
        //     uploadPath = await fileUploadHelper.uploadSingleFile(req.body.folder_name, fileName, cleanedBase64File);
        // }
        // req.body.image = uploadPath
        const catalog = new Catalog(req.body);
        await catalog.save();

        // Trigger PDF generation
        // console.log("req.body : ", req.body);
        let pdfUrl = '';
        // if (category_id) {
        //     pdfUrl = `${uri}/api/catalog/pdf_generator/category/${category_id}?stock=${stock_quantity}&stock_operator=${stock_quantity_operator}&price=${sale_price}&price_operator=${sale_price_operator}`;
        // } else if (item_group_id) {
        //     pdfUrl = `${uri}/api/catalog/pdf_generator/item_group/${item_group_id}?stock=${stock_quantity || ''}&price=${sale_price || ''}`;
        // }

        const catIds = Array.isArray(category_id) ? category_id.join(',') : category_id || '';
        const groupIds = Array.isArray(item_group_id) ? item_group_id.join(',') : item_group_id || '';

        pdfUrl = `${uri}/api/catalog/pdf_generator/combined?category_id=${catIds}&item_group_id=${groupIds}&stock=${stock_quantity || ''}&stock_operator=${encodeURIComponent(stock_quantity_operator || '>')}&price=${sale_price || ''}&price_operator=${encodeURIComponent(sale_price_operator || '<=')}`;

        if (pdfUrl) {
            axios.get(pdfUrl)
                .then(() => console.log('PDF generation triggered'))
                .catch(err => console.error('PDF generation error:', err.message));
        }


        res.status(201).json({ message: `Catalog ${CREATE_MESSAGE}`, pdfUrl });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Customers
exports.getAllCatalog = async (req, res) => {
    try {
        const catalogs = await Catalog.find()
            .populate('category_id item_group_id vendor_id vendor_group_id customer_id')
            .sort({ _id: -1 });

        const mappedCatalogs = catalogs.map(catalog => {
            let pdfUrl = '';

            const stock = catalog.stock_quantity || '';
            const stock_operator = catalog.stock_quantity_operator || '>';
            const price = catalog.sale_price || '';
            const price_operator = catalog.sale_price_operator || '<=';

            const catIds = Array.isArray(catalog.category_id) ? catalog.category_id.map(cat => cat._id || cat).filter(Boolean).join(',') : '';
            const groupIds = Array.isArray(catalog.item_group_id) ? catalog.item_group_id.map(item => item._id || item).filter(Boolean).join(',') : '';

            pdfUrl = `${uri}/api/catalog/pdf_generator/combined?category_id=${catIds}&item_group_id=${groupIds}&stock=${stock}&stock_operator=${encodeURIComponent(stock_operator)}&price=${price}&price_operator=${encodeURIComponent(price_operator)}`;

            return {
                ...catalog.toObject(),
                pdfUrl
            };
        });

        res.status(200).json(mappedCatalogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get Customer by ID
exports.getCatalogById = async (req, res) => {
    try {
        const catalog = await Catalog.findById(req.params.id);
        if (!catalog) {
            return res.status(404).json({ message: "catalog not found" });
        }
        res.status(200).json(catalog);
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ error: error.message });
    }
};

// Update Customer by ID
exports.updateCatalogById = async (req, res) => {
    try {
        const catalog = await Catalog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!catalog) {
            return res.status(404).json({ message: "catalog not found" });
        }
        res.status(200).json({ message: `catalog ${UPDATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Customer by ID
exports.deleteCatalogById = async (req, res) => {
    try {
        const catalog = await Catalog.findByIdAndDelete(req.params.id);
        if (!catalog) {
            return res.status(404).json({ message: "catalog not found" });
        }
        res.status(200).json({ message: `catalog ${DELETE_MESSAGE}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete all catalogs
exports.deleteAllCatalogs = async (req, res) => {
    try {
        console.log("Deleting all catalogs... in CatalogController.js");
        const deletedCatalogs = await Catalog.deleteMany({});
        return res.status(200).json({
            status: 'success',
            message: `${deletedCatalogs.deletedCount} catalogs deleted successfully`
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error while deleting catalogs',
            error: error.message
        });
    }
};


exports.getCatalogData = async (req, res) => {
    try {
        let query = {};
        const category_id = req.params.category_id || req.query.category_id;
        const item_group_id = req.params.item_group_id || req.query.item_group_id;

        if (category_id && category_id !== "undefined") {
            const ids = category_id.split(',').filter(id => id && id !== "undefined");
            if (ids.length > 0) {
                // query.category_id = { $in: ids };
                const categories = await Category.find({
                    $or: [
                        { _id: { $in: ids } },
                        { parent_id: { $in: ids } }
                    ]
                });
                const allCategoryIds = categories.map(cat => cat._id.toString());
                const finalCategoryIds = Array.from(new Set([...ids, ...allCategoryIds]));
                query.category_id = { $in: finalCategoryIds };
            }
        }
        if (item_group_id && item_group_id !== "undefined") {
            const ids = item_group_id.split(',').filter(id => id && id !== "undefined");
            if (ids.length > 0) {
                const itemGroups = await ItemGroup.find({
                    $or: [
                        { _id: { $in: ids } },
                        { parent_id: { $in: ids } }
                    ]
                });
                const allItemGroupIds = itemGroups.map(ig => ig._id.toString());
                const finalItemGroupIds = Array.from(new Set([...ids, ...allItemGroupIds]));
                query.item_group_id = { $in: finalItemGroupIds };
            }
        }



        if (req.query.stock && req.query.stock !== "") {
            const stockVal = Number(req.query.stock);
            if (!isNaN(stockVal)) {
                let op;
                switch (req.query.stock_operator) {
                    case '>': op = '$gt'; break;
                    case '<': op = '$lt'; break;
                    case '>=': op = '$gte'; break;
                    case '<=': op = '$lte'; break;
                    case '=': op = '$eq'; break;
                    default: op = '$gte';
                }
                query['item_attribute.variant.stock'] = { [op]: stockVal };
            }
        }
        if (req.query.price && req.query.price !== "") {
            const priceVal = Number(req.query.price);
            if (!isNaN(priceVal)) {
                let op;
                switch (req.query.price_operator) {
                    case '>': op = '$gt'; break;
                    case '<': op = '$lt'; break;
                    case '>=': op = '$gte'; break;
                    case '<=': op = '$lte'; break;
                    case '=': op = '$eq'; break;
                    default: op = '$gte';
                }
                query.sale_price = { [op]: priceVal };
            }
        }

        console.log("Generated Catalog Query: ", JSON.stringify(query, null, 2));

        const items = await Item.find(query)
            .populate({ path: 'category_id' })
            .populate({ path: 'item_group_id' })
            .populate({ path: 'unit_id' })
            .populate({ path: 'brand_id' })
            .sort({ name: 1 });


        const pdfContents = await Promise.all(items.map(async item => {
            let imageBase64 = '';
            if (item.image && item.image.length > 0) {
                try {
                    // Try to find the image in common upload locations
                    const possiblePaths = [
                        path.join(process.cwd(), 'uploadFile_masale', item.image[0]),
                        path.join(process.cwd(), 'public', item.image[0]),
                        path.join(process.cwd(), '..', 'uploadFile_masale', item.image[0]),
                        path.join(process.cwd(), '..', 'server', 'uploadFile_masale', item.image[0])
                    ];

                    let finalPath = '';
                    for (const p of possiblePaths) {
                        console.log(`Checking image path: ${p}`);
                        if (fs.existsSync(p)) {
                            finalPath = p;
                            console.log(`✓ Image found at: ${p}`);
                            break;
                        }
                    }

                    if (finalPath) {
                        const { base64File } = pathToBase64(finalPath);
                        imageBase64 = base64File ? `data:image/png;base64,${base64File}` : '';
                    } else {
                        console.warn(`✗ Image NOT found for item ${item.name} at any checked path. Database value: ${item.image[0]}`);
                    }
                } catch (err) {
                    console.error(`Error processing image for item ${item.name}: ${err.message}`);
                }
            }

            const variant = item.item_attribute?.variant && item.item_attribute.variant[0] ? item.item_attribute.variant[0] : null;
            const salePrice = variant?.selling_price || item.sale_price || 0;
            const mrp = variant?.price || item.mrp || 0;
            const stock = item.stock || variant?.stock || 0;

            return {
                name: item.name,
                discount: item.discount,
                category_name: item.category_id ? item.category_id.name : null,
                item_group_name: item.item_group_id ? item.item_group_id.name : null,
                brand_name: item.brand_id ? item.brand_id.name : null,
                unit_name: item.unit_id ? item.unit_id.name : null,
                alternate_unit: item.alternate_unit,
                conversion_factor: item.conversion_factor,
                sale_price: salePrice,
                mrp: mrp,
                stock_quantity: stock,
                vendor_discount: item.vendor_discount,
                item_attribute: item.item_attribute,
                image: imageBase64
            };
        }));
        // console.log("pdfContents: ", pdfContents); 
        res.render('catalogPdf', { pdfContents });
        // res.status(200).json({ "data":formattedItems });
    } catch (error) {
        console.error("error in getCatalogData: ", error);
        console.error("failed query: ", JSON.stringify(query, null, 2));
        res.status(400).json({ error: error.message });
    }
};
