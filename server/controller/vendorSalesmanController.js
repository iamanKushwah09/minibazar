const Customer = require('../models/Customer');

// Get vendor-salesman association report
exports.getVendorSalesmanReport = async (req, res) => {
    try {
        // Get all vendors
        const vendors = await Customer.find({
            $or: [
                { group_type: "Vendor" },
                { group_type: "vendor" }
            ]
        }).populate('salesman_id', 'name').populate('vendor_group_id', 'name');

        // Categorize vendors
        const vendorsWithSalesman = vendors.filter(vendor => vendor.salesman_id);
        const vendorsWithoutSalesman = vendors.filter(vendor => !vendor.salesman_id);

        const report = {
            totalVendors: vendors.length,
            vendorsWithSalesman: {
                count: vendorsWithSalesman.length,
                percentage: vendors.length > 0 ? ((vendorsWithSalesman.length / vendors.length) * 100).toFixed(1) : 0,
                vendors: vendorsWithSalesman.map(vendor => ({
                    id: vendor._id,
                    name: vendor.name,
                    email: vendor.email,
                    mobile: vendor.mobile,
                    salesman: vendor.salesman_id?.name || null,
                    vendorGroup: vendor.vendor_group_id?.name || null
                }))
            },
            vendorsWithoutSalesman: {
                count: vendorsWithoutSalesman.length,
                percentage: vendors.length > 0 ? ((vendorsWithoutSalesman.length / vendors.length) * 100).toFixed(1) : 0,
                vendors: vendorsWithoutSalesman.map(vendor => ({
                    id: vendor._id,
                    name: vendor.name,
                    email: vendor.email,
                    mobile: vendor.mobile,
                    vendorGroup: vendor.vendor_group_id?.name || null
                }))
            },
            allVendorsHaveSalesman: vendorsWithoutSalesman.length === 0
        };

        res.status(200).json(report);
    } catch (error) {
        console.error('Error generating vendor-salesman report:', error);
        res.status(500).json({ 
            message: 'Error generating report', 
            error: error.message 
        });
    }
};