const VendorGroup = require('../models/vendorGroup.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const axios = require("axios");
// Create a new Vendor Group
exports.createVendorGroup = async (req, res) => {
    try {
        const newVendorGroup = new VendorGroup(req.body);
        await newVendorGroup.save();
        res.status(201).json({ message: `Vendor group  ${CREATE_MESSAGE}` });
    } catch (error) {
        console.log(error,'error')
        res.status(400).json({ message: error.message });
    }
};

// Get all Vendor Groups
// exports.getAllVendorGroups = async (req, res) => {
//     try {
//         const vendorGroups = await VendorGroup.find();
//         res.status(200).json(vendorGroups);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
exports.getAllVendorGroups = async (req, res) => {
    try {
        const vendorGroups = await VendorGroup.find()
        .sort({ _id: -1 })
        .populate({
          path: 'parent_id',
          select: 'name', // Select only the `name` field from the parent
        })
        .lean(); // Convert Mongoose documents to plain objects for further manipulation
      const resultWithAlias = vendorGroups.map(item => ({
        ...item,
        parent_name: item.parent_id ? item.parent_id.name : null, // Assign the parent name to `parent_name`
        parent_id: undefined // Optionally remove `parent_id` if not needed
      }));
      res.status(200).json(resultWithAlias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Vendor Group by ID
exports.getVendorGroupById = async (req, res) => {
    try {
        const vendorGroup = await VendorGroup.findById(req.params.id);
        if (!vendorGroup) return res.status(404).json({ message: 'Vendor Group not found' });
        res.status(200).json(vendorGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Vendor Group by ID
exports.updateVendorGroupById = async (req, res) => {
    try {
        const updatedVendorGroup = await VendorGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVendorGroup) return res.status(404).json({ message: 'Vendor Group not found' });
        res.status(200).json({ message: `Vendor group  ${UPDATE_MESSAGE}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Vendor Group by ID
exports.deleteVendorGroupById = async (req, res) => {
    try {
        const deletedVendorGroup = await VendorGroup.findByIdAndDelete(req.params.id);
        if (!deletedVendorGroup) return res.status(404).json({ message: 'Vendor Group not found' });
        res.status(200).json({ message: `Vendor group ${DELETE_MESSAGE}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete all vendorGroups
exports.deleteAllVendorGroups = async (req, res) => {
  try {
    console.log("Deleting all VendorGroups... in VendorGroupController.js");
    const deletedVendorGroups = await VendorGroup.deleteMany({});
    return res.status(200).json({
      status: 'success',
      message: `${deletedVendorGroups.deletedCount} VendorGroups deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting VendorGroups',
      error: error.message
    });
  }
};


exports.getActive = async (req, res) => {
    try {
        const vendorGroups = await VendorGroup.find({is_active:true})
            .sort({ _id: -1 });
        res.status(200).json(vendorGroups);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
                url: `${process.env.BUSY_API}/Account/GetAccountGroup`,
                headers: { },
                timeout: 5000 // 5 second timeout
            };
            const response = await axios.request(config);
            Data = response.data.Data;
        }
        if (!Data || Data.length === 0) {
            return res.status(404).json({ message: 'No data received from Busy API' });
        }


        for (const {ParentGrpName, ParentGrpCode, AppCode, GroupCode , GroupName} of Data) {            
            // Update or create parent group
            let parentGroup = await VendorGroup.findOneAndUpdate(
                {
                    busy_group_id: ParentGrpCode
                },
                {
                    name: ParentGrpName,
                    busy_group_id: ParentGrpCode,
                    code: AppCode,
                    is_active: true,
                    is_parent_group: true
                },
                {
                    upsert: true,
                    new: true
                }
            );

            // Only proceed with child group if we have the required data
            if (GroupCode && GroupName) {
                // Update or create child group
                await VendorGroup.findOneAndUpdate(
                    {
                        busy_group_id: GroupCode
                    },
                    {
                        parent_id: parentGroup._id,
                        name: GroupName,
                        busy_group_id: GroupCode,
                        code: AppCode,
                        is_active: true,
                        is_parent_group: false
                    },
                    {
                        upsert: true,
                        new: true
                    }
                );
            }
        }
        // const checkParentAlreadyExist = await VendorGroup.find({is_active:true});
        res.status(200).json({
            message: "Vendor groups refreshed successfully"
        });

    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({ message: 'Request timeout - API took too long to respond' });
        }
        res.status(500).json({ message: error.message });
    }
};

// discount
// : 
// "10"
// is_active
// : 
// 1
// is_parent_group
// : 
// true
// name
// : 
// "k;lk;"
// parent_id
// : 
// "67460d5bc9812935fcc5a775"
// salesman_id
// : 
// "67fb740628edd80ea81639de"

