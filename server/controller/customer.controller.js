const Customer = require('../models/customer.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum");
const PDFDocument = require("pdfkit-table");
const VendorGroup = require('../models/vendorGroup.model');
const axios = require("axios");
const bcrypt = require("bcryptjs");
const Country = require('../models/Country');
const State = require('../models/State');
const DirectCustomer = require('../models/directCustomer.model');

// Create new Customer
exports.createCustomer = async (req, res) => {
    try {
        const customerData = { ...req.body };
        if (customerData.password) {
            customerData.password = bcrypt.hashSync(customerData.password, 10);
        }
        const customer = new Customer(customerData);
        await customer.save();
        res.status(201).json({ message: `Customer ${CREATE_MESSAGE}` });
    } catch (error) {
        console.error("🔐 Error creating customer/vendor:", error);
        res.status(400).json({ error: error.message });
    }
};
// Get all Customers
exports.getAllCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 10, q, salesmanId } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        let query = {};
        if (q) {
            const trimmedQ = q.trim();
            const words = trimmedQ.split(/\s+/);
            const wordConditions = words.map(word => {
                const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const wordRegex = new RegExp(escapedWord, 'i');
                return {
                    $or: [
                        { name: wordRegex },
                        { email: wordRegex },
                        { mobile: wordRegex },
                        { code: wordRegex },
                        { alias: wordRegex },
                        { print_name: wordRegex }
                    ]
                };
            });
            query.$and = wordConditions;
        }

        // Filter by salesmanId from query OR from logged in user
        const effectiveSalesmanId = salesmanId || req.user?.salesman_id;
        if (effectiveSalesmanId) {
            query.salesman_id = effectiveSalesmanId;
        }
        const total = await Customer.countDocuments(query);
        const customers = await Customer.find(query)
            .skip(skip)
            .limit(limitNum)
            .sort({ created_date: -1 }); // Sort by newest first
        const totalPages = Math.ceil(total / limitNum);
        res.status(200).json({
            data: customers,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid customer ID format" });
        }

        const customer = await Customer.findById(id).lean();
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        customer.shipping_address = customer?.shipping_address ? JSON.parse(customer?.shipping_address) : [{ shipping_address: "" }];
        customer.password = customer.view_password;
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Customer by ID
exports.updateCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid customer ID format" });
        }
        // Hash password if provided in update
        const updateData = { ...req.body };
        if (updateData.password && updateData.password.trim() !== '') {
            updateData.view_password = updateData.password;
            updateData.password = bcrypt.hashSync(updateData.password, 10);
        } else if (updateData.password === '') {
            // Remove password field if empty string is provided
            delete updateData.password;
        }
        const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: `Customer ${UPDATE_MESSAGE}` });
    } catch (error) {
        console.error("🔐 Error updating customer/vendor:", error);
        res.status(400).json({ error: error.message });
    }
};

// Delete Customer by ID
exports.deleteCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid customer ID format" });
        }

        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: `Customer ${DELETE_MESSAGE}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Find or create customer by mobile number (for guest checkout)
exports.findOrCreateCustomerByMobile = async (req, res) => {
    try {
        const { mobile, firstName, lastName, email, address, country_id, state_id, city_id, pincode, print_name, remarks } = req.body;

        // 1. Always use CASH SALES for the accounting customer
        let mainCustomer = await Customer.findOne({ name: 'CASH SALES' });
        if (!mainCustomer) {
            return res.status(404).json({ message: "CASH SALES customer not found. Please create 'CASH SALES' in Busy or Admin panel." });
        }

        // 2. Create or Update DirectCustomer for the actual details
        if (!mobile) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        let directCustomer = await DirectCustomer.findOne({ mobile: mobile.trim() });

        const directCustomerData = {
            name: `${firstName} ${lastName}`,
            print_name: print_name || `${firstName} ${lastName}`,
            mobile: mobile.trim(),
            email: email || `${mobile.trim()}@guest.com`,
            address: address || "",
            country_id: country_id || null,
            state_id: state_id || null,
            city_id: city_id || null,
            pincode: pincode || null,
            remarks: remarks || null,
            is_active: true,
            is_guest: true
        };

        if (directCustomer) {
            directCustomer = await DirectCustomer.findByIdAndUpdate(
                directCustomer._id,
                directCustomerData,
                { new: true }
            );
        } else {
            directCustomer = new DirectCustomer(directCustomerData);
            await directCustomer.save();
        }

        return res.status(200).json({
            message: "Customer processed successfully",
            customer: mainCustomer,
            directCustomer: directCustomer,
            isGeneric: true
        });
    } catch (error) {
        console.error("Error in findOrCreateCustomerByMobile:", error);
        res.status(500).json({
            message: "Failed to find or create customer",
            error: error.message
        });
    }
};

// Delete all customers
exports.deleteAllCustomers = async (req, res) => {
    try {
        console.log("Deleting all Customers... in CustomerController.js");
        const deletedCustomers = await Customer.deleteMany({});
        return res.status(200).json({
            status: 'success',
            message: `${deletedCustomers.deletedCount} customers deleted successfully`
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error while deleting Vendors',
            error: error.message
        });
    }
};


exports.getCustomerNameAndId = async (req, res) => {
    try {
        const { q = "", page = 1, limit = 100, ...otherFilters } = req.query;
        const trimmedQ = q.trim();
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Filter by salesmanId from query OR from logged in user
        const effectiveSalesmanId = otherFilters.salesman_id || req.user?.salesman_id;
        let query = { is_active: true, ...otherFilters };
        if (effectiveSalesmanId) {
            query.salesman_id = effectiveSalesmanId;
        }

        // Make group_type case-insensitive to match both "Vendor" and "vendor"
        if (query.group_type) {
            query.group_type = { $regex: new RegExp(`^${query.group_type}$`, 'i') };
        }

        // 1. Build Search Query (Combination Word Search)
        if (trimmedQ) {
            const words = trimmedQ.split(/\s+/);
            const wordConditions = words.map(word => {
                const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const wordRegex = new RegExp(escapedWord, 'i');
                return {
                    $or: [
                        { name: wordRegex },
                        { code: wordRegex },
                        { alias: wordRegex },
                        { print_name: wordRegex }
                    ]
                };
            });
            query.$and = wordConditions;
        }

        // 2. Perform Search with Relevance Scoring
        const pipeline = [
            { $match: query },
            {
                $addFields: {
                    relevance: {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $or: [
                                            { $eq: [{ $toLower: "$name" }, trimmedQ.toLowerCase()] },
                                            { $eq: [{ $toLower: "$print_name" }, trimmedQ.toLowerCase()] }
                                        ]
                                    },
                                    then: 100
                                },
                                {
                                    case: {
                                        $regexMatch: {
                                            input: "$name",
                                            regex: `^${trimmedQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
                                            options: "i"
                                        }
                                    },
                                    then: 50
                                },
                                {
                                    case: {
                                        $or: [
                                            { $eq: ["$code", trimmedQ] },
                                            { $eq: ["$alias", trimmedQ] }
                                        ]
                                    },
                                    then: 40
                                }
                            ],
                            default: 1
                        }
                    }
                }
            },
            { $sort: { relevance: -1, name: 1 } },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: limitNum },
                        {
                            $lookup: {
                                from: "vendorgroups",
                                localField: "vendor_group_id",
                                foreignField: "_id",
                                as: "vendor_group_data"
                            }
                        },
                        { $unwind: { path: "$vendor_group_data", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                code: 1,
                                print_name: 1,
                                vendor_group_id: "$vendor_group_data"
                            }
                        }
                    ]
                }
            }
        ];

        const [result] = await Customer.aggregate(pipeline);
        const total = result.metadata[0]?.total || 0;
        const totalPages = Math.ceil(total / limitNum);

        return res.status(200).json({
            status: "success",
            data: result.data,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                hasNext: pageNum < totalPages
            }
        });
    } catch (error) {
        console.error("Customer search error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error while searching customers",
            error: error.message
        });
    }
};



exports.getBusyRefreshData = async (req, res) => {
    try {
        let Data;
        if (req.body && req.body.Data) {
            Data = req.body.Data;
        } else {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.BUSY_API}/Account/GetAccountMaster`,
                headers: {},
                timeout: 0 // 5 second timeout
            };
            const response = await axios.request(config);
            Data = response.data.Data;
        }
        console.log('Data received from Busy API:', JSON.stringify(Data));
        if (!Data || Data.length === 0) {
            return res.status(404).json({ message: 'No data received from Busy API' });
        }


        // Process data in smaller chunks to reduce memory usage
        const chunkSize = 100; // Adjust chunk size based on your needs
        for (let i = 0; i < Data.length; i += chunkSize) {
            const chunk = Data.slice(i, i + chunkSize);

            // Process each chunk
            await Promise.all(chunk.map(async ({
                AccCode,
                AccName,
                ParentGrpCode,
                ParentGrpName,
                AppCode,
                Alias,
                PrintName,
                Address1,
                Address2,
                Address3,
                Address4,
                GSTNo,
                CountryName,
                StateName,
                CityName,
                Email,
                Mobile,
                WhatsAppNo,
                ITPAN,
                CreditLimit,
                SalesmanCode,
                SalesmanName,
                DelerType,
                BankName,
                IfscCode,
                AccNo
            }) => {
                try {
                    // Find vendor group with lean()
                    const vendorGroup = await VendorGroup.findOne({
                        is_active: true,
                        busy_group_id: ParentGrpCode
                    }).lean();
                    // Find country and state
                    const country = CountryName ? await Country.findOne({
                        name: { $regex: CountryName, $options: 'i' } // 'i' = case-insensitive
                    }) : null;
                    const state = StateName ? await State.findOne({
                        name: { $regex: StateName, $options: 'i' }
                    }) : null;
                    if (!vendorGroup) {
                        throw new Error(`Vendor group not found for ParentGrpCode: ${ParentGrpCode}`);
                    }
                    // Prepare address and bank details
                    const address = [Address1, Address2, Address3, Address4, CityName, StateName, CountryName]
                        .filter(Boolean)
                        .join(', ');
                    const bankDetails = [BankName, IfscCode, AccNo]
                        .filter(Boolean)
                        .join(' | ');
                    // Update or create customer
                    await Customer.findOneAndUpdate(
                        {
                            code: AccCode
                        },
                        {
                            name: AccName,
                            code: AccCode,
                            is_active: true,
                            vendor_group_id: vendorGroup._id,
                            alias: Alias || null,
                            print_name: PrintName || null,
                            address: address || null,
                            gst_no: GSTNo || null,
                            group_type: "Vendor",
                            is_credit_limit: Boolean(SalesmanCode),
                            mobile: Mobile || null,
                            tel_no: WhatsAppNo || null,
                            bank_detail: bankDetails || null,
                            // email: Email || null,
                            salesman_code: SalesmanCode ?? null,
                            country_id: country ? country._id : null,
                            state_id: state ? state._id : null
                        },
                        {
                            upsert: true,
                            new: true
                        }
                    );

                } catch (itemError) {
                    console.error(`Error processing vendor ${AccName}:`, itemError);
                }
            }));

            // Allow garbage collection between chunks
            global.gc && global.gc();
        }

        res.status(200).json({
            message: "Vendor refreshed successfully"
        });

    } catch (error) {
        console.error('API Error:', error);

        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({
                success: false,
                message: 'Request timeout - API took too long to respond'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to refresh vendor data',
            error: error.message
        });
    }
};

exports.getPartyLedger = async (req, res) => {
    try {
        const { code, startDate, endDate } = req.body;
        if (!code || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: code, startDate or endDate'
            });
        }
        const config = {
            method: 'post',
            url: `${process.env.BUSY_API}/Account/GetPartyLedger`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                AccountCode: code,
                StartDate: startDate,
                EndDate: endDate
            },
            timeout: 5000 // 2 second timeout
        };
        const response = await axios.request(config);
        // console.log(response)
        res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        // console.error('Party Ledger API Error:', error);
        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({
                success: false,
                message: 'Request timeout - API took too long to respond'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to fetch party ledger data',
            error: error.message
        });
    }
};
exports.getBillReceivable = async (req, res) => {
    try {
        const { AccountCode } = req.body;
        console.log(AccountCode, 'AccountCode');
        if (!AccountCode) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: AccountCode'
            });
        }
        const config = {
            method: 'post',
            url: `${process.env.BUSY_API}/Reports/BillsReceivables`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                AccountCode: AccountCode,
                DateAsOn: new Date().toISOString()
            },
            timeout: 5000
        };
        const response = await axios.request(config);
        res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        // console.error('Bill Receivable API Error:', error);
        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({
                success: false,
                message: 'Request timeout - API took too long to respond'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Bill Receivable data',
            error: error.message
        });
    }
};

exports.getPartyLedgerPDF = async (req, res) => {
    try {
        const { code, startDate, endDate, vendorName } = req.body;
        if (!code || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Missing parameters' });
        }

        const config = {
            method: 'post',
            url: `${process.env.BUSY_API}/Account/GetPartyLedger`,
            headers: { 'Content-Type': 'application/json' },
            data: { AccountCode: code, StartDate: startDate, EndDate: endDate },
            timeout: 60000
        };

        const busyRes = await axios.request(config);
        const partyLedgerData = busyRes.data;

        // Ensure we have the data object and ledger
        const ledger = partyLedgerData?.Data?.Ledger || partyLedgerData?.Ledger;
        const balance = partyLedgerData?.Data?.Balance || partyLedgerData?.Balance;

        if (!ledger) {
            return res.status(404).json({ success: false, message: 'No ledger data found from API' });
        }

        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        // Use a safe filename
        const safeVendorName = (vendorName || code).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ledger_${safeVendorName}.pdf`);

        doc.pipe(res);

        // Header
        doc.fontSize(18).text('Party Ledger', { align: 'center' });
        doc.fontSize(10).text('Selection Footwear', { align: 'center' });
        doc.moveDown();

        doc.fontSize(10).text(`Party Name: ${vendorName || code}`);
        doc.text(`Period: ${startDate} to ${endDate}`);
        doc.moveDown();

        doc.moveDown(1);
        // Opening Balance Highlight
        doc.fillColor('#f3f4f6').rect(30, doc.y, 535, 22).fill();
        doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(11).text(`Opening Balance: ₹${Number(balance?.OpeningBal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 35, doc.y - 16);
        doc.fillColor('black').font('Helvetica').moveDown(1.5);

        const drawRow = (row, y, isHeader = false) => {
            const font = isHeader ? 'Helvetica-Bold' : 'Helvetica';
            const size = isHeader ? 9 : 7;
            doc.font(font).fontSize(size);

            const cols = [
                { x: 30, w: 60, text: row.date },
                { x: 90, w: 90, text: row.account },
                { x: 180, w: 60, text: row.vchType },
                { x: 240, w: 60, text: row.vchNo },
                { x: 300, w: 70, text: row.debit, align: 'right' },
                { x: 370, w: 70, text: row.credit, align: 'right' },
                { x: 440, w: 125, text: row.narrative }
            ];

            let maxHeight = 0;
            cols.forEach(col => {
                const height = doc.heightOfString(col.text, { width: col.w - 5 });
                if (height > maxHeight) maxHeight = height;
            });

            // Check if we need a new page
            if (y + maxHeight > 780) {
                doc.addPage();
                y = 30; // Reset Y for new page
                // Draw header again on new page
                y = drawRow(headerRow, y, true);
            }

            cols.forEach(col => {
                doc.text(col.text, col.x, y, { width: col.w - 5, align: col.align || 'left' });
            });

            // Draw horizontal line
            doc.moveTo(30, y + maxHeight + 2).lineTo(565, y + maxHeight + 2).lineWidth(0.1).strokeOpacity(0.2).stroke();

            return y + maxHeight + 5;
        };

        const headerRow = {
            date: "Date",
            account: "Account",
            vchType: "Vch Type",
            vchNo: "Vch No",
            debit: "Debit",
            credit: "Credit",
            narrative: "Narrative"
        };

        let currentY = doc.y + 10;
        currentY = drawRow(headerRow, currentY, true);

        ledger.forEach(item => {
            const rowData = {
                date: item.DATE || "",
                account: item.Account || "",
                vchType: item.VCHTYPE || "",
                vchNo: item.VCHNO || "",
                debit: Math.abs(item.DebitAmt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
                credit: (item.CreditAmt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
                narrative: String(item.SHORTNAR || "")
            };
            currentY = drawRow(rowData, currentY);
        });

        if (currentY > 750) doc.addPage();
        doc.moveDown(2);

        // Closing Balance Highlight
        const closingBalY = doc.y;
        doc.fillColor('#ecfdf5').rect(30, closingBalY, 535, 25).fill();
        doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(12).text(`Closing Balance: ₹${Number(balance?.ClosingBal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 35, closingBalY + 7, { align: 'right', width: 520 });

        doc.moveDown(2);

        doc.end();

    } catch (error) {
        console.error('PDF Generation Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal Server Error during PDF generation', error: error.message });
        }
    }
};