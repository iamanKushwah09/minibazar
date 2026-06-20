const express = require('express');
const router = express.Router();
const { runAllSyncs } = require('../cron');

const { syncCategory } = require('../controller/categoryController');
const { syncUnit } = require('../controller/unit.controller');
const { syncItemGroupData } = require('../controller/itemGroup.controller');
const { syncItemData } = require('../controller/item.controller');
const { getBusyRefreshData: syncVendorGroupData } = require('../controller/vendorGroup.controller');
const { getBusyRefreshData: syncCustomerData } = require('../controller/customer.controller');
const { syncSaleTypeData } = require('../controller/saleType.controller');
const { syncBillSundry } = require('../controller/billSundryController');
const { syncSundryDiscount } = require('../controller/sundryDiscountController');
const { syncAttributeData } = require('../controller/attribute.controller');
const { syncAttributeValueData } = require('../controller/attributevalue.controller');
const { getBusyRefreshSaleman: syncSalesmanData } = require('../controller/sales.controller');

// Expose these as push webhooks where external systems POST payload
// The external system should provide `{ "Data": [...] }` inside the body

router.put('/categories', syncCategory);
router.put('/units', syncUnit);
router.put('/item-groups', syncItemGroupData);
router.put('/items', syncItemData);
router.put('/vendor-groups', syncVendorGroupData);
router.put('/account-groups', syncVendorGroupData); // Alias
router.put('/customers', syncCustomerData);
router.put('/accounts', syncCustomerData); // Alias
router.put('/sale-types', syncSaleTypeData);
router.put('/bill-sundries', syncBillSundry);
router.put('/sundry-discounts', syncSundryDiscount);
router.put('/attributes', syncAttributeData);
router.put('/attribute-group', syncAttributeData); // Alias
router.put('/attribute-values', syncAttributeValueData);
router.put('/salesman', syncSalesmanData);

// // Master Autosync - Runs everything
// router.post('/autosync', async (req, res) => {
//     try {
//         // Trigger in background but respond immediately to avoid timeout
//         runAllSyncs();
//         res.status(202).json({ message: 'Full synchronization started in the background.' });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to start synchronization', error: error.message });
//     }
// });

module.exports = router;
