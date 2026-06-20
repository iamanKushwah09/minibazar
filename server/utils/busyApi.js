const axios = require('axios');


const sendToBusyAPI = async (saleOrderData, busyPayloadJSON = {}) => {
    try {
        // Construct the payload for Busy API
        const busyPayload = {
            Date: saleOrderData.date,
            VoucherNo: "1234567890" || "",
            SaleType: busyPayloadJSON.SaleType || "",
            MatCentre: saleOrderData.matCentre || "",
            Customer: busyPayloadJSON.Customer || "",
            Salesman: busyPayloadJSON?.Salesman || "",
            Items: (saleOrderData.items || []).map(item => ({
                Image: item.image || "",
                Name: item.name || "",
                ItemId: item.itemId?._id || "",
                Hsn: item.hsn || "",
                Quantity: Number(item.quantity) || 0,
                Unit: item.unit || "pairs",
                ListPrice: Number(item.listPrice) || 0,
                Discount: Number(item.discount) || 0,
                TotalDiscount: Number(item.totalDiscount) || 0,
                Price: Number(item.price) || 0,
                Amount: Number(item.amount) || 0,
                conversion_factor: item.conversion_factor || 1,
                Colour: item.color || item.colour || "",
                Size: item.size || "",
                Description: item.description || ""
            })),
            Sundries: {
                SundriesDetail: (saleOrderData.sundries && saleOrderData.sundries.SundriesDetail)
                    ? saleOrderData.sundries.SundriesDetail.map(s => ({
                        Name: s.Name || s.name || "",
                        DiscountAmount: Number(s.DiscountAmount) || Number(s.discountAmount) || 0,
                        DiscountPercent: Number(s.DiscountPercent) || Number(s.discountPercent) || 0
                    }))
                    : []
            },
            TotalAmount: Number(saleOrderData.totalAmount) || 0,
            TotalDiscountAmount: Number(saleOrderData.totalDiscountAmount) || 0,
            TotalQuantity: Number(saleOrderData.totalQuantity) || 0,
            NetAmount: Number(saleOrderData.netAmount) || 0
        };
        // Send payload to Busy API
        const busyResponse = await axios.post(`${process.env.BUSY_API}/SaleOrder`,
            busyPayload,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                maxBodyLength: Infinity
            }
        );
        console.log("Busy API Response:", JSON.stringify(busyResponse.data));
        if (Number(busyResponse.data.Status) == 0) {
            return {
                success: false,
                error: busyResponse.data,
                voucherNo: null
            };
        } else {
            return {
                success: true,
                voucherNo: busyResponse.data.Data?.[0]?.VchNo || null
            };
        }

    } catch (error) {
        console.log("Error sending to Busy API:", error.response ? error.response.data : error.message);
        return {
            success: false,
            error: error.response ? error.response.data : error.message,
            voucherNo: null
        };
    }
};

/**
 * Common function to populate code fields and names for Busy API
 * @param {Object} saleOrderData - The sale order data
 * @param {Object} models - Object containing the required models
 * @returns {Promise<Object>} - Returns updated saleOrderData and busyPayloadJSON
 */
const populateBusyPayloadData = async (saleOrderData, models) => {
    const { SaleType, Customer, Salesman, Item } = models;
    let busyPayloadJSON = {};

    try {
        // Populate sale type
        if (saleOrderData.saleType) {
            const saleType = await SaleType.findById(saleOrderData.saleType);
            if (saleType && saleType.code) {
                saleOrderData.saleTypeCode = saleType.code;
                busyPayloadJSON.SaleType = saleType.name;
            }
        }

        // Populate customer
        if (saleOrderData.customer) {
            const customer = await Customer.findById(saleOrderData.customer);
            if (customer && customer.code) {
                saleOrderData.customerCode = customer.code;
                busyPayloadJSON.Customer = customer.name;
            }
        }

        // Populate salesman
        if (saleOrderData.salesman) {
            const salesman = await Salesman.findById(saleOrderData.salesman);
            if (salesman && salesman.code) {
                saleOrderData.salesmanCode = salesman.code;
                busyPayloadJSON.Salesman = salesman.name;
            }
        }

        // Update items with conversion_factor from Item model
        if (saleOrderData.items && saleOrderData.items.length > 0) {
            for (let i = 0; i < saleOrderData.items.length; i++) {
                const item = await Item.findById(saleOrderData.items[i].itemId);
                if (item && item.conversion_factor) {
                    saleOrderData.items[i].conversion_factor = item.conversion_factor;
                }
            }
        }

        return {
            saleOrderData,
            busyPayloadJSON
        };

    } catch (error) {
        console.log("Error populating Busy payload data:", error);
        throw error;
    }
};

/**
 * Complete function that handles the entire Busy API integration process
 * @param {Object} saleOrderData - The sale order data
 * @param {Object} models - Object containing the required models
 * @returns {Promise<Object>} - Returns the complete result
 */
const processBusyAPIIntegration = async (saleOrderData, models) => {
    try {
        // Step 1: Populate code fields and names
        const { saleOrderData: updatedSaleOrderData, busyPayloadJSON } = await populateBusyPayloadData(saleOrderData, models);

        // Step 2: Send to Busy API
        const busyResult = await sendToBusyAPI(updatedSaleOrderData, busyPayloadJSON);

        // Step 3: Update sale order data with voucher number if successful
        if (busyResult.success && busyResult.voucherNo) {
            updatedSaleOrderData.voucherNo = busyResult.voucherNo;
        }

        return {
            saleOrderData: updatedSaleOrderData,
            busyResult
        };

    } catch (error) {
        console.log("Error in Busy API integration process:", error);
        return {
            saleOrderData,
            busyResult: {
                success: false,
                error: error.message,
                voucherNo: null
            }
        };
    }
};

module.exports = {
    sendToBusyAPI,
    populateBusyPayloadData,
    processBusyAPIIntegration
};
