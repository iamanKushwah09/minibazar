const SaleOrder = require('../models/saleorder.model');
const SaleType = require('../models/SaleType.model');
const Customer = require('../models/customer.model');
const Salesman = require('../models/Sales.model');
const Item = require('../models/item.model');
const Unit = require('../models/Unit')
const DirectCustomer = require('../models/directCustomer.model');
const axios = require("axios");
const { sendToBusyAPI } = require('../utils/busyApi');
const { createDispatchLog } = require('./dispatchLog.controller');
const dispatchlogModel = require('../models/dispatchlog.model');
const { pathToBase64 } = require('../common/folderToBase64');
const fileUploadHelper = require('../fileUploader/fileUploadHelper');
const logger = require('../utils/logger');
const { buildDateRangeQuery } = require('../middleware/dateValidation.middleware');


// Create a new sale order
exports.createSaleOrder = async (req, res) => {
    try {

        const saleOrderData = { ...req.body };
        let busyPayloadJSON = {};
        if (saleOrderData?.saleType) {
            const saleType = await SaleType.findById(saleOrderData.saleType);
            if (saleType && saleType.code) {
                saleOrderData.saleTypeCode = saleType.code;
                busyPayloadJSON.SaleType = saleType.name;
            }
        }
        if (saleOrderData?.customer) {
            const customer = await Customer.findById(saleOrderData.customer);
            if (customer && customer.code) {
                saleOrderData.customerCode = customer.code;
                busyPayloadJSON.Customer = customer.name;
            }
        }
        if (saleOrderData?.salesman != "store") {
            const salesman = await Salesman.findById(saleOrderData.salesman);
            if (salesman && salesman.code) {
                saleOrderData.salesmanCode = salesman.code;
                busyPayloadJSON.Salesman = salesman.name;
            }

        } else {
            const salesman = await Salesman.findOne({ "name": "General" });
            saleOrderData.salesmanCode = salesman.code;
            saleOrderData.salesman = salesman._id;
            busyPayloadJSON.Salesman = "General"

        }

        if (saleOrderData.items && saleOrderData.items.length > 0) {
            for (let i = 0; i < saleOrderData.items.length; i++) {
                // Fix: Convert empty object {} or invalid image values to empty string for image field
                if (saleOrderData.items[i].image === null || saleOrderData.items[i].image === undefined) {
                    saleOrderData.items[i].image = '';
                } else if (typeof saleOrderData.items[i].image === 'object') {
                    // Handle empty object {} case
                    saleOrderData.items[i].image = '';
                } else if (typeof saleOrderData.items[i].image !== 'string') {
                    // Convert non-string values to string
                    saleOrderData.items[i].image = String(saleOrderData.items[i].image) || '';
                }

                if (saleOrderData.items[i].unit) {
                    const unit = await Unit.findById(saleOrderData.items[i].unit);
                    if (unit && unit.name) {
                        saleOrderData.items[i].unit = unit.name;
                    }
                }
                const item = await Item.findById(saleOrderData.items[i].itemId);
                if (item) {
                    if (!saleOrderData.items[i].listPrice || saleOrderData.items[i].listPrice == 0) {
                        saleOrderData.items[i].listPrice = item.sale_price;
                    }
                    if (saleOrderData.items[i].discount === undefined || saleOrderData.items[i].discount === null || saleOrderData.items[i].discount == 0) {
                        saleOrderData.items[i].discount = item.discount || 0;
                    }
                    if (item.conversion_factor) {
                        saleOrderData.items[i].conversion_factor = item.conversion_factor;
                    }
                }
            }
        }
        
        // Round numerical amounts to 2 decimal places to prevent floating point precision issues
        if (saleOrderData.netAmount !== undefined) saleOrderData.netAmount = Math.round(Number(saleOrderData.netAmount) * 100) / 100;
        if (saleOrderData.totalAmount !== undefined) saleOrderData.totalAmount = Math.round(Number(saleOrderData.totalAmount) * 100) / 100;
        if (saleOrderData.totalDiscountAmount !== undefined) saleOrderData.totalDiscountAmount = Math.round(Number(saleOrderData.totalDiscountAmount) * 100) / 100;
        
        // const busyResponse = await sendToBusyAPI(saleOrderData, busyPayloadJSON);
        // saleOrderData.voucherNo = busyResponse.voucherNo ? busyResponse.voucherNo.trim() : null;
        const newSaleOrder = new SaleOrder(saleOrderData);
        await newSaleOrder.save();
        res.status(201).json({ message: "Sale Order Created" });
    } catch (err) {
        console.log("Error in creating sale Order:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get a sale order by ID
exports.getSaleOrderById = async (req, res) => {
    try {
        const saleOrder = await SaleOrder.findById(req.params.saleorderid)
            .populate('saleType', 'name')
            .populate('customer', 'name email mobile address gst_type group_type gst_no aadhaar_no pincode is_guest _id code')
            .populate('directCustomer')
            .populate('salesman', 'name')
            .populate('items.itemId', 'name hsn_code unit_id sale_price discount conversion_factor image default_image item_attribute')
            .exec();
        if (!saleOrder) return res.status(404).json({ message: 'Sale order not found' });
        res.status(200).json(saleOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a sale order by ID
exports.updateSaleOrderById = async (req, res) => {
    try {
        // Check if sale order exists and has busyApiStatus as 'SUCCESS'
        const existingSaleOrder = await SaleOrder.findById(req.params.saleorderid).exec();
        if (!existingSaleOrder) {
            return res.status(404).json({ message: 'Sale order not found' });
        }

        // Prevent update if busyApiStatus is 'SUCCESS'
        if (existingSaleOrder.busyApiStatus === 'SUCCESS') {
            return res.status(403).json({
                message: 'Cannot update sale order that has been successfully processed with Busy API',
                error: 'BUSY_API_PROCESSED'
            });
        }

        const saleOrderData = { ...req.body };
        let busyPayloadJSON = {};
        if (saleOrderData.saleType) {
            const saleType = await SaleType.findById(saleOrderData.saleType);
            if (saleType && saleType.code) {
                saleOrderData.saleTypeCode = saleType.code;
                busyPayloadJSON.SaleType = saleType.name;
            }
        }
        if (saleOrderData.customer) {
            const customer = await Customer.findById(saleOrderData.customer);
            if (customer && customer.code) {
                saleOrderData.customerCode = customer.code;
                busyPayloadJSON.Customer = customer.name;
            }
        }
        if (saleOrderData.salesman) {
            const salesman = await Salesman.findById(saleOrderData.salesman);
            if (salesman && salesman.code) {
                saleOrderData.salesmanCode = salesman.code;
                busyPayloadJSON.Salesman = salesman.name;
            }
        }
        if (saleOrderData.items && saleOrderData.items.length > 0) {
            for (let i = 0; i < saleOrderData.items.length; i++) {
                // Fix: Convert empty object {} or invalid image values to empty string for image field
                if (saleOrderData.items[i].image === null || saleOrderData.items[i].image === undefined) {
                    saleOrderData.items[i].image = '';
                } else if (typeof saleOrderData.items[i].image === 'object') {
                    // Handle empty object {} case
                    saleOrderData.items[i].image = '';
                } else if (typeof saleOrderData.items[i].image !== 'string') {
                    // Convert non-string values to string
                    saleOrderData.items[i].image = String(saleOrderData.items[i].image) || '';
                }

                if (saleOrderData.items[i].unit) {
                    const unit = await Unit.findById(saleOrderData.items[i].unit);
                    if (unit && unit.name) {
                        saleOrderData.items[i].unit = unit.name;
                    }
                }
                const item = await Item.findById(saleOrderData.items[i].itemId);
                if (item) {
                    if (!saleOrderData.items[i].listPrice || saleOrderData.items[i].listPrice == 0) {
                        saleOrderData.items[i].listPrice = item.sale_price;
                    }
                    if (saleOrderData.items[i].discount === undefined || saleOrderData.items[i].discount === null || saleOrderData.items[i].discount == 0) {
                        saleOrderData.items[i].discount = item.discount || 0;
                    }
                    if (item.conversion_factor) {
                        saleOrderData.items[i].conversion_factor = item.conversion_factor;
                    }
                }
            }
        }

        // Round numerical amounts to 2 decimal places to prevent floating point precision issues
        if (saleOrderData.netAmount !== undefined) saleOrderData.netAmount = Math.round(Number(saleOrderData.netAmount) * 100) / 100;
        if (saleOrderData.totalAmount !== undefined) saleOrderData.totalAmount = Math.round(Number(saleOrderData.totalAmount) * 100) / 100;
        if (saleOrderData.totalDiscountAmount !== undefined) saleOrderData.totalDiscountAmount = Math.round(Number(saleOrderData.totalDiscountAmount) * 100) / 100;

        const updatedSaleOrder = await SaleOrder.findByIdAndUpdate(
            req.params.saleorderid,
            saleOrderData,
            { new: true }
        ).exec();
        if (!updatedSaleOrder) return res.status(404).json({ message: 'Sale order not found' });
        res.status(201).json({ message: "Sale Order Updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a sale order by ID
exports.deleteSaleOrderById = async (req, res) => {
    try {
        // Check if sale order exists and has busyApiStatus as 'SUCCESS'
        const existingSaleOrder = await SaleOrder.findById(req.params.saleorderid).exec();
        if (!existingSaleOrder) {
            return res.status(404).json({ message: 'Sale order not found' });
        }

        // Prevent deletion if busyApiStatus is 'SUCCESS'
        if (existingSaleOrder.busyApiStatus === 'SUCCESS') {
            return res.status(403).json({
                message: 'Cannot delete sale order that has been successfully processed with Busy API',
                error: 'BUSY_API_PROCESSED'
            });
        }

        const deletedSaleOrder = await SaleOrder.findByIdAndDelete(req.params.saleorderid).exec();
        if (!deletedSaleOrder) return res.status(404).json({ message: 'Sale order not found' });
        res.status(200).json({ message: 'Sale Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSaleOrder = async (req, res) => {
    try {
        let query = {};
        if (req.user?.salesman_id) {
            query.salesman = req.user.salesman_id;
        }
        const saleOrders = await SaleOrder.find(query)
            .populate('saleType', 'name')
            .populate('customer', 'name email mobile address gst_type group_type gst_no aadhaar_no pincode is_guest _id remarks')
            .populate('directCustomer')
            .populate('salesman', 'name')
            .sort({ createdAt: -1 })
            .exec();

        res.status(200).json(saleOrders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Search sale orders by text query
exports.searchSaleOrders = async (req, res) => {
    try {
        const searchQuery = req.query.q || req.query.search || '';

        if (!searchQuery || searchQuery.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
                timestamp: new Date().toISOString()
            });
        }

        const searchTerm = searchQuery.trim();

        // Build search query - search across multiple fields
        // 1. First, search for direct customers if they match the searchTerm
        const matchingDirectCustomers = await DirectCustomer.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { mobile: { $regex: searchTerm, $options: 'i' } }
            ]
        }).select('_id');

        const directCustomerIds = matchingDirectCustomers.map(dc => dc._id);

        const searchConditions = {
            $or: [
                { voucherNo: { $regex: searchTerm, $options: 'i' } },
                { 'customer.name': { $regex: searchTerm, $options: 'i' } },
                { 'customer.email': { $regex: searchTerm, $options: 'i' } },
                { 'customer.mobile': { $regex: searchTerm, $options: 'i' } },
                { 'customer.gst_no': { $regex: searchTerm, $options: 'i' } },
                { 'salesman.name': { $regex: searchTerm, $options: 'i' } },
                { 'saleType.name': { $regex: searchTerm, $options: 'i' } },
                { directCustomer: { $in: directCustomerIds } }
            ],
            isActive: true
        };

        if (req.user?.salesman_id) {
            searchConditions.salesman = req.user.salesman_id;
        }

        const saleOrders = await SaleOrder.find(searchConditions)
            .populate('saleType', 'name code')
            .populate('customer', 'name email mobile address gst_type group_type gst_no aadhaar_no pincode is_guest _id')
            .populate('directCustomer')
            .populate('salesman', 'name code')
            .populate('items.itemId', 'name hsn_code unit_id sale_price discount conversion_factor image default_image item_attribute')
            .sort({ date: -1, createdAt: -1 })
            .limit(100) // Limit results for performance
            .lean()
            .exec();

        res.status(200).json({
            success: true,
            data: {
                orders: saleOrders,
                count: saleOrders.length,
                searchQuery: searchTerm
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in searchSaleOrders:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while searching sale orders',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Get sale orders with comprehensive filtering
exports.getSaleOrdersByDateRange = async (req, res) => {
    const startTime = Date.now();
    const requestId = req.requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {


        // Extract pagination parameters with defaults
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20)); // Default 20 items per page
        const skip = (page - 1) * limit;

        // Build base query
        let query = { isActive: true };

        // Add date range filter if validated dates are available
        if (req.validatedDates) {
            const dateRangeQuery = buildDateRangeQuery(req.validatedDates);
            query = { ...query, ...dateRangeQuery };
            logger.info(`[${requestId}] Date range filter applied`, {
                dateQuery: dateRangeQuery,
                startDate: req.validatedDates.startDate?.toISOString(),
                endDate: req.validatedDates.endDate?.toISOString()
            });
        }

        // Add status filter
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Add customer filter (handle both ObjectId and name search)
        if (req.query.customer) {
            // If it looks like an ObjectId, use direct match
            if (req.query.customer.match(/^[0-9a-fA-F]{24}$/)) {
                query.customer = req.query.customer;
            } else {
                // If it's a name, search in customer name field
                query['customer.name'] = { $regex: req.query.customer, $options: 'i' };
            }
        }

        // Add salesman filter (handle both ObjectId and name search)
        const effectiveSalesmanId = req.query.salesman || req.user?.salesman_id;
        if (effectiveSalesmanId) {
            if (String(effectiveSalesmanId).match(/^[0-9a-fA-F]{24}$/)) {
                query.salesman = effectiveSalesmanId;
            } else {
                query['salesman.name'] = { $regex: effectiveSalesmanId, $options: 'i' };
            }
        }

        // Add amount range filters
        if (req.query.minAmount || req.query.maxAmount) {
            query.totalAmount = {};
            if (req.query.minAmount) {
                query.totalAmount.$gte = parseFloat(req.query.minAmount);
            }
            if (req.query.maxAmount) {
                query.totalAmount.$lte = parseFloat(req.query.maxAmount);
            }
        }

        // Add search functionality (search in multiple fields)
        if (req.query.search) {
            const searchTerm = req.query.search.trim();

            // 1. First, search for direct customers if they match the searchTerm
            const matchingDirectCustomers = await DirectCustomer.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } },
                    { mobile: { $regex: searchTerm, $options: 'i' } }
                ]
            }).select('_id');

            const directCustomerIds = matchingDirectCustomers.map(dc => dc._id);

            query.$or = [
                { voucherNo: { $regex: searchTerm, $options: 'i' } },
                { 'customer.name': { $regex: searchTerm, $options: 'i' } },
                { 'customer.email': { $regex: searchTerm, $options: 'i' } },
                { 'customer.mobile': { $regex: searchTerm, $options: 'i' } },
                { 'customer.gst_no': { $regex: searchTerm, $options: 'i' } },
                { 'salesman.name': { $regex: searchTerm, $options: 'i' } },
                { 'saleType.name': { $regex: searchTerm, $options: 'i' } },
                { directCustomer: { $in: directCustomerIds } }
            ];
        }

        logger.info(`[${requestId}] Built query`, { query });

        // Execute query with pagination
        const [saleOrders, totalCount] = await Promise.all([
            SaleOrder.find(query)
                .populate('saleType', 'name code')
                .populate('customer', 'name email mobile address gst_type group_type gst_no aadhaar_no pincode is_guest _id')
                .populate('directCustomer')
                .populate('salesman', 'name code')
                .populate('items.itemId', 'name hsn_code unit_id sale_price discount conversion_factor image default_image item_attribute')
                .sort({ date: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            SaleOrder.countDocuments(query)
        ]);

        // Calculate summary statistics for the filtered results
        const summaryStats = await SaleOrder.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' },
                    totalQuantity: { $sum: '$totalQuantity' },
                    avgOrderValue: { $avg: '$totalAmount' },
                    minOrderValue: { $min: '$totalAmount' },
                    maxOrderValue: { $max: '$totalAmount' }
                }
            }
        ]);

        // Get status breakdown
        const statusBreakdown = await SaleOrder.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        // Performance metrics
        const processingTime = Date.now() - startTime;

        // Define additional filters for response metadata
        const additionalFilters = ['status', 'customer', 'salesman', 'search', 'minAmount', 'maxAmount'];

        const responseData = {
            success: true,
            data: {
                orders: saleOrders,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNext,
                    hasPrev,
                    nextPage: hasNext ? page + 1 : null,
                    prevPage: hasPrev ? page - 1 : null
                },
                summary: summaryStats[0] || {
                    totalOrders: 0,
                    totalAmount: 0,
                    totalQuantity: 0,
                    avgOrderValue: 0,
                    minOrderValue: 0,
                    maxOrderValue: 0
                },
                statusBreakdown: statusBreakdown.map(item => ({
                    status: item._id,
                    count: item.count,
                    totalAmount: item.totalAmount,
                    percentage: totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(2) : '0.00'
                }))
            },
            performance: {
                processingTimeMs: processingTime,
                databaseQueryTime: processingTime // Simplified for this example
            },
            filters: {
                appliedDateRange: req.validatedDates ? {
                    startDate: req.validatedDates.startDate?.toISOString(),
                    endDate: req.validatedDates.endDate?.toISOString()
                } : null,
                additionalFilters: additionalFilters.reduce((acc, filter) => {
                    if (req.query[filter]) acc[filter] = req.query[filter];
                    return acc;
                }, {})
            },
            timestamp: new Date().toISOString(),
            requestId
        };

        logger.info(`[${requestId}] Sale order date range query completed successfully`, {
            totalOrders: totalCount,
            returnedOrders: saleOrders.length,
            page,
            limit,
            processingTime,
            hasFilters: Object.keys(responseData.filters.appliedDateRange || {}).length > 0 ||
                Object.keys(responseData.filters.additionalFilters).length > 0
        });

        res.status(200).json(responseData);

    } catch (error) {
        const processingTime = Date.now() - startTime;

        logger.error(`[${requestId}] Error in getSaleOrdersByDateRange`, {
            error: error.message,
            stack: error.stack,
            query: req.query,
            processingTime,
            errorType: error.name
        });

        // Handle specific error types
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'INVALID_PARAMETER',
                message: 'Invalid parameter format provided',
                details: `Invalid value for parameter: ${error.path}`,
                timestamp: new Date().toISOString(),
                requestId
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(422).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Database validation error',
                details: Object.values(error.errors).map(err => err.message),
                timestamp: new Date().toISOString(),
                requestId
            });
        }

        // Generic server error
        return res.status(500).json({
            success: false,
            error: 'DATABASE_ERROR',
            message: 'An error occurred while querying sale orders',
            timestamp: new Date().toISOString(),
            requestId,
            ...(process.env.NODE_ENV === 'development' && {
                errorDetails: error.message,
                stack: error.stack
            })
        });
    }
};

// Get sale orders by customer ID with aggregated data
exports.getSaleOrdersByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const saleOrders = await SaleOrder.find({ customer: customerId })
            .populate('saleType', 'name')
            .populate('customer', 'name')
            .populate('directCustomer')
            .populate('salesman', 'name')
            .populate('items.itemId', 'name hsn_code unit_id sale_price discount conversion_factor image default_image item_attribute')
            .sort({ createdAt: -1 })
            .exec();
        // Calculate aggregated data
        const totalOrders = saleOrders.length;
        const totalAmount = saleOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const startOrders = saleOrders.filter(order => order.status === 'Start').length;
        const processingOrders = saleOrders.filter(order => order.status === 'Processing').length;
        const deliveredOrders = saleOrders.filter(order => order.status === 'Delivered').length;
        // Get recent 5 orders
        const recentOrders = saleOrders.slice(0, 5);
        const aggregatedData = {
            totalOrders,
            totalAmount,
            startOrders,
            processingOrders,
            deliveredOrders,
            recentOrders,
            orders: saleOrders
        };
        res.status(200).json(aggregatedData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get order history by customer ID (paginated)
exports.getOrderHistoryByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalOrders = await SaleOrder.countDocuments({ customer: customerId });
        const saleOrders = await SaleOrder.find({ customer: customerId })
            .populate('saleType', 'name')
            .populate('customer', 'name')
            .populate('directCustomer')
            .populate('salesman', 'name')
            .populate('items.itemId', 'name hsn_code unit_id sale_price discount conversion_factor image default_image item_attribute')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        const totalPages = Math.ceil(totalOrders / limit);
        res.status(200).json({
            orders: saleOrders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.dispatchUpdate = async (req, res) => {
    try {
        const { saleorderid } = req.params;
        const saleOrderData = req.body; // ✅ assuming the update data comes from request body
        // console.log(saleOrderData,'saleOrderData')
        // Check if ID exists
        if (!saleorderid) {
            return res.status(400).json({
                success: false,
                message: "Sale Order ID is required",
            });
        }

        // Check if sale order exists and has busyApiStatus as 'SUCCESS'
        const existingSaleOrder = await SaleOrder.findById(saleorderid).exec();
        if (!existingSaleOrder) {
            return res.status(404).json({
                success: false,
                message: 'Sale order not found'
            });
        }

        // Prevent update if busyApiStatus is 'SUCCESS'
        if (existingSaleOrder.busyApiStatus === 'SUCCESS') {
            return res.status(403).json({
                success: false,
                message: 'Cannot update sale order that has been successfully processed with Busy API',
                error: 'BUSY_API_PROCESSED'
            });
        }

        const { images, ...saleOrderdata } = saleOrderData;

        // Fix: Convert empty object {} or invalid image values to empty string for image field in items
        if (saleOrderdata.items && saleOrderdata.items.length > 0) {
            for (let i = 0; i < saleOrderdata.items.length; i++) {
                if (saleOrderdata.items[i].image === null || saleOrderdata.items[i].image === undefined) {
                    saleOrderdata.items[i].image = '';
                } else if (typeof saleOrderdata.items[i].image === 'object') {
                    // Handle empty object {} case
                    saleOrderdata.items[i].image = '';
                } else if (typeof saleOrderdata.items[i].image !== 'string') {
                    // Convert non-string values to string
                    saleOrderdata.items[i].image = String(saleOrderdata.items[i].image) || '';
                }
            }
        }

        // Perform update
        const updatedSaleOrder = await SaleOrder.findByIdAndUpdate(saleorderid, saleOrderdata, { new: true, runValidators: true }).exec();
        let dispatches = [];
        if (Array.isArray(images) && images.length > 0) {
            dispatches = await Promise.all(
                images
                    .filter((image) => image.base64File && image.fileName)
                    .map(async (image) => {
                        const { base64File, fileName } = image;
                        const cleanedBase64File = base64File.split(';base64,').pop();
                        return await fileUploadHelper.uploadSingleFile(`dispatch/${saleorderid}`, fileName.replace(/\s+/g, ''), cleanedBase64File);
                    })
            );
        }

        await dispatchlogModel.create({ "status": saleOrderData.status, "orderDetails_id": saleorderid, "updateDescription": saleOrderData.description, "grNo": saleOrderData.grNo, "lot": saleOrderData.lotNo, "images": dispatches });
        // If no document found
        if (!updatedSaleOrder) {
            return res.status(404).json({
                success: false,
                message: "Sale Order not found",
            });
        }
        // ✅ Success Response
        return res.status(200).json({
            success: true,
            message: "Sale Order updated successfully",
            data: updatedSaleOrder,
        });

    } catch (error) {
        console.error("❌ Error updating sale order:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while updating sale order",
            error: error.message,
        });
    }
};

// Get dashboard data for admin
exports.getDashboardData = async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        let query = {};
        if (req.user?.salesman_id) {
            query.salesman = req.user.salesman_id;
        }

        // Get all orders
        const allOrders = await SaleOrder.find(query).sort({ createdAt: -1 });

        // Calculate total orders
        const totalOrders = allOrders.length;

        // Calculate orders by status
        const ordersPending = allOrders.filter(order => order.status === 'Start').length;
        const ordersProcessing = allOrders.filter(order => order.status === 'Processing').length;
        const ordersDelivered = allOrders.filter(order => order.status === 'Delivered').length;

        // Calculate sales by time periods
        const todaySales = allOrders
            .filter(order => order.createdAt >= today)
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const yesterdaySales = allOrders
            .filter(order => order.createdAt >= yesterday && order.createdAt < today)
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const thisMonthSales = allOrders
            .filter(order => order.createdAt >= thisMonth)
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const lastMonthSales = allOrders
            .filter(order => order.createdAt >= lastMonth && order.createdAt < thisMonth)
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const allTimeSales = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Calculate weekly sales (last 7 days)
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        const weeklySales = allOrders
            .filter(order => order.createdAt >= weekAgo)
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Get best selling products
        const productSales = {};
        allOrders.forEach(order => {
            if (order.items && order.items.length > 0) {
                order.items.forEach(item => {
                    const itemId = item.itemId?.toString();
                    if (itemId) {
                        if (!productSales[itemId]) {
                            productSales[itemId] = {
                                itemId: item.itemId,
                                name: item.name,
                                totalQuantity: 0,
                                totalAmount: 0
                            };
                        }
                        productSales[itemId].totalQuantity += item.quantity || 0;
                        productSales[itemId].totalAmount += item.amount || 0;
                    }
                });
            }
        });

        const bestSellingProducts = Object.values(productSales)
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 10)
            .map(product => ({
                itemId: product.itemId,
                name: product.name,
                totalQuantity: product.totalQuantity,
                totalAmount: product.totalAmount
            }));

        // Get recent orders (last 5)
        const recentOrders = allOrders.slice(0, 5).map(order => ({
            _id: order._id,
            voucherNo: order.voucherNo,
            customer: order.customer,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt
        }));

        const dashboardData = {
            totalOrders,
            ordersPending,
            ordersProcessing,
            ordersDelivered,
            sales: {
                today: todaySales,
                yesterday: yesterdaySales,
                thisMonth: thisMonthSales,
                lastMonth: lastMonthSales,
                allTime: allTimeSales,
                weekly: weeklySales
            },
            bestSellingProducts,
            recentOrders
        };

        res.status(200).json(dashboardData);
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).json({ message: err.message });
    }
};



// Robust sale order processing endpoint
exports.processSaleOrder = async (req, res) => {
    try {
        // Extract and validate request parameters
        const { saleorderid } = req.params;
        const { forceReprocess } = req.query;

        // Validate required parameters
        if (!saleorderid) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_PARAMETER',
                message: 'Sale order ID is required',
                timestamp: new Date().toISOString()
            });
        }

        // Validate MongoDB ObjectId format
        if (!saleorderid.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_ID_FORMAT',
                message: 'Invalid sale order ID format',
                timestamp: new Date().toISOString()
            });
        }

        // Step 1: Retrieve sale order by unique identifier
        // console.log(`Processing sale order: ${saleorderid}`);

        const saleOrder = await SaleOrder.findById(saleorderid)
            .populate('saleType', 'name code')
            .populate('customer', 'name code email mobile address gst_type group_type gst_no aadhaar_no pincode is_guest _id')
            .populate('directCustomer')
            .populate('salesman', 'name code')
            .populate('items.itemId', 'name hsn_code unit_id sale_price discount conversion_factor')
            .exec();




        // Check if sale order exists
        if (!saleOrder) {
            return res.status(404).json({
                success: false,
                error: 'SALE_ORDER_NOT_FOUND',
                message: 'Sale order not found',
                timestamp: new Date().toISOString()
            });
        }

        // console.log(saleOrder, 'saleOrder')
        // Step 2: Data validation and transformation
        // const validationResult = validateSaleOrderData(saleOrder);
        // if (!validationResult.isValid) {
        //     return res.status(422).json({
        //         success: false,
        //         error: 'VALIDATION_FAILED',
        //         message: 'Sale order data validation failed',
        //         validationErrors: validationResult.errors,
        //         timestamp: new Date().toISOString()
        //     });
        // }
        // Step 3: Check if already processed and force reprocess flag
        // if (saleOrder.voucherNo && !forceReprocess) {
        //     return res.status(200).json({
        //         success: true,
        //         message: 'Sale order already processed',
        //         data: {
        //             saleOrderId: saleOrder._id,
        //             voucherNo: saleOrder.voucherNo,
        //             status: 'ALREADY_PROCESSED',
        //             processedAt: saleOrder.updatedAt
        //         },
        //         timestamp: new Date().toISOString()
        //     });
        // }

        // Step 4: Transform data for Busy API
        // console.log('Transforming sale order data for Busy API integration');

        const { transformedData, busyPayloadJSON } = await transformDataForBusyAPI(saleOrder);
        // Step 5: Send processed data to Busy API integration service
        const busyApiResult = await sendToBusyAPI(transformedData, busyPayloadJSON);
        if (!busyApiResult.success) {
            return res.status(400).json({
                status: false,
                error: 'BUSY_API_ERROR',
                message: busyApiResult?.error?.ErrorMessage,
            });
        }

        // Step 6: Handle Busy API response and update sale order
        let updateData = {
            updatedAt: new Date()
        };

        // let processingResult = {
        //     saleOrderId: saleOrder._id,
        //     voucherNo: saleOrder.voucherNo,
        //     busyApiResponse: busyApiResult,
        //     processedAt: new Date()
        // };
        // if (busyApiResult.success && busyApiResult.voucherNo) {
        //     // Successful processing
        //     updateData.voucherNo = busyApiResult.voucherNo.trim();
        //     updateData.busyApiStatus = 'SUCCESS';
        //     updateData.lastProcessedAt = new Date();
        //     processingResult.status = 'PROCESSED_SUCCESSFULLY';
        //     processingResult.voucherNo = updateData.voucherNo;
        //     console.log(`Sale order ${saleorderid} processed successfully with voucher: ${updateData.voucherNo}`);
        // } else {
        //     // Failed processing
        //     updateData.busyApiStatus = 'FAILED';
        //     updateData.busyApiError = busyApiResult.error || 'Unknown error';
        //     updateData.lastFailedAt = new Date();
        //     processingResult.status = 'PROCESSING_FAILED';
        //     processingResult.error = busyApiResult.error;

        //     console.error(`Sale order ${saleorderid} processing failed:`, busyApiResult.error);
        // }



        // Step 7: Update sale order with processing results
        if (busyApiResult.voucherNo) {
            const updatedSaleOrder = await SaleOrder.findByIdAndUpdate(
                saleorderid,
                { ...(busyApiResult?.voucherNo && { voucherNo: busyApiResult.voucherNo }), "busyApiStatus": busyApiResult.voucherNo && busyApiResult.success ? 'SUCCESS' : 'FAILED' },
                { new: true, runValidators: true }
            ).exec();
        }



        // Step 8: Return appropriate response
        // if (busyApiResult.success) {
        return res.status(200).json({
            status: true,
            message: 'Sale order processed successfully',
            // data: processingResult,
            // saleOrder: updatedSaleOrder,
            // timestamp: new Date().toISOString()
        });
        // } else {
        //     return res.status(502).json({
        //         success: false,
        //         error: 'BUSY_API_PROCESSING_FAILED',
        //         message: 'Failed to process sale order with Busy API',
        //         // data: processingResult,
        //         timestamp: new Date().toISOString()
        //     });
        // }

    } catch (error) {
        // Comprehensive error handling
        console.error('Error in processSaleOrder:', error);

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(422).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Database validation error',
                details: error.errors,
                timestamp: new Date().toISOString()
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'INVALID_ID',
                message: 'Invalid sale order ID format',
                timestamp: new Date().toISOString()
            });
        }

        // Generic server error
        return res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred while processing the sale order',
            timestamp: new Date().toISOString()
        });
    }
};

// Data validation function
const validateSaleOrderData = (saleOrder) => {
    const errors = [];

    // Required fields validation
    if (!saleOrder.saleType) {
        errors.push('Sale type is required');
    }

    if (!saleOrder.customer) {
        errors.push('Customer is required');
    }

    if (!saleOrder.salesman) {
        errors.push('Salesman is required');
    }

    if (!saleOrder.items || !Array.isArray(saleOrder.items) || saleOrder.items.length === 0) {
        errors.push('At least one item is required');
    }

    // Items validation
    if (saleOrder.items && saleOrder.items.length > 0) {
        saleOrder.items.forEach((item, index) => {
            if (!item.itemId) {
                errors.push(`Item ${index + 1}: itemId is required`);
            }
            if (!item.quantity || item.quantity <= 0) {
                errors.push(`Item ${index + 1}: valid quantity is required`);
            }
            if (!item.price || item.price < 0) {
                errors.push(`Item ${index + 1}: valid price is required`);
            }
        });
    }

    // Numeric validations
    if (saleOrder.totalAmount !== undefined && saleOrder.totalAmount < 0) {
        errors.push('Total amount cannot be negative');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Data transformation function
const transformDataForBusyAPI = async (saleOrder) => {
    const busyPayloadJSON = {};
    const transformedData = { ...saleOrder.toObject() };

    try {
        // Transform sale type
        if (saleOrder.saleType && saleOrder.saleType.name) {
            busyPayloadJSON.SaleType = saleOrder.saleType.name;
        }

        // Transform customer
        if (saleOrder.customer && saleOrder.customer.name) {
            busyPayloadJSON.Customer = saleOrder.customer.name;
        }

        // Transform salesman
        if (saleOrder.salesman && saleOrder.salesman.name) {
            busyPayloadJSON.Salesman = saleOrder.salesman.name;
        }

        // Transform items - ensure all required fields are present
        if (transformedData.items && transformedData.items.length > 0) {
            transformedData.items = transformedData.items.map(item => ({
                ...item,
                quantity: Number(item.quantity) || 0,
                price: Number(item.price) || 0,
                discount: Number(item.discount) || 0,
                totalDiscount: Number(item.totalDiscount) || 0,
                amount: Number(item.amount) || 0,
                conversion_factor: item.conversion_factor || 1
            }));
        }

        // Ensure numeric fields are properly typed
        transformedData.totalAmount = Number(transformedData.totalAmount) || 0;
        transformedData.netAmount = Number(transformedData.netAmount) || 0;
        transformedData.totalDiscountAmount = Number(transformedData.totalDiscountAmount) || 0;
        transformedData.totalQuantity = Number(transformedData.totalQuantity) || 0;

        // Ensure date is properly formatted
        if (transformedData.date) {
            transformedData.date = new Date(transformedData.date);
        }

    } catch (error) {
        console.error('Error transforming data for Busy API:', error);
        throw new Error('Data transformation failed: ' + error.message);
    }

    return {
        transformedData,
        busyPayloadJSON
    };
};
