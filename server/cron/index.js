const cron = require('node-cron');
const axios = require('axios');
const Item = require('../models/item.model');
const ItemGroup = require('../models/itemGroup.model');
const Category = require('../models/category.model');
const Customer = require('../models/customer.model');
const VendorGroup = require('../models/vendorGroup.model');
const SaleType = require('../models/SaleType.model');
const BillSundry = require('../models/BillSundry.modal');
const SundryDiscount = require('../models/SundryDiscount.modal');
const Unit = require('../models/Unit');
const Country = require('../models/Country');
const State = require('../models/State');
const { syncItemData } = require('../controller/item.controller');
const { syncCategory } = require('../controller/categoryController');
const { syncUnit } = require('../controller/unit.controller');
const { syncItemGroupData } = require('../controller/itemGroup.controller');
const { getBusyRefreshData: syncAccountGroupData } = require('../controller/vendorGroup.controller');
const { getBusyRefreshData: syncAccountData } = require('../controller/customer.controller');
const { syncSaleTypeData } = require('../controller/saleType.controller');
const { syncBillSundry } = require('../controller/billSundryController');
const { syncSundryDiscount } = require('../controller/sundryDiscountController');
const { syncAttributeData } = require('../controller/attribute.controller');
const { syncAttributeValueData } = require('../controller/attributevalue.controller');





// Mock response object to handle controller res.send/res.json calls
const mockRes = {
  status: function () { return this; },
  send: function () { return this; },
  json: function () { return this; }
};
const mockReq = {};

// 7. Sync Bill Sundries
// 8. Sync Sundry Discounts



// Run all sync tasks in sequence
const runAllSyncs = async () => {
  console.log('🚀 Starting Full Data Synchronization at:', new Date().toLocaleString());
  try {
    // 1. Sync Categories
    console.log('🔄 Cron: Syncing Categories...');
    await syncCategory(mockReq, mockRes);

    // 2. Sync Units
    console.log('🔄 Cron: Syncing Units...');
    await syncUnit(mockReq, mockRes);

    // 3. Sync Item Groups
    console.log('🔄 Cron: Syncing Item Groups...');
    await syncItemGroupData(mockReq, mockRes);

    // 4. Sync Items & Stock
    console.log('🔄 Cron: Syncing Items & Stock...');
    await syncItemData(mockReq, mockRes);

    // 5. Sync Account Groups (Vendor Groups)
    console.log('🔄 Cron: Syncing Account Groups...');
    await syncAccountGroupData(mockReq, mockRes);

    // 6. Sync Accounts (Customers)
    console.log('🔄 Cron: Syncing Accounts...');
    await syncAccountData(mockReq, mockRes);

    // 7. Sync Sale Types
    console.log('🔄 Cron: Syncing Sale Types...');
    await syncSaleTypeData(); // This one doesn't seem to take req/res in some versions, but let's check

    // 8. Sync Bill Sundries (Local)
    await syncBillSundry();

    // 9. Sync Sundry Discounts (Local)
    await syncSundryDiscount();
    
    // 10. Sync Attributes & Attribute Values
    console.log('🔄 Cron: Syncing Attributes...');
    await syncAttributeData(mockReq, mockRes);
    console.log('🔄 Cron: Syncing Attribute Values...');
    await syncAttributeValueData(mockReq, mockRes);

    console.log('✅ Cron: Full Data Synchronization Finished');
  } catch (error) {
    console.error('❌ Cron: Error during synchronization:', error.message);
  }
};
// Schedule daily sync at midnight
cron.schedule('0 0 * * *', () => {
  runAllSyncs();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});
// Schedule cron job to run at 12:00 AM (midnight) every day
const startCron = () => {
  // Run once on startup
  runAllSyncs();


  console.log('📅 Cron: Synchronization job scheduled for 12:00 AM IST daily');
};

module.exports = {
  startCron,
  runAllSyncs
};
