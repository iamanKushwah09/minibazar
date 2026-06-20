require("dotenv").config();
const { connectDB } = require("../config/db");
const Customer = require("../models/Customer");
const Salesman = require("../models/Salesman");
const VendorGroup = require("../models/vendorGroup.model");

connectDB();

const checkVendorSalesmanAssociation = async () => {
  try {
    console.log("🔍 Checking vendor-salesman associations...\n");

    // Get all vendors (customers with group_type "Vendor" or "vendor")
    const vendors = await Customer.find({
      $or: [
        { group_type: "Vendor" },
        { group_type: "vendor" }
      ]
    }).populate('salesman_id', 'name').populate('vendor_group_id', 'name');

    console.log(`📊 Total vendors found: ${vendors.length}\n`);

    if (vendors.length === 0) {
      console.log("❌ No vendors found in the database.");
      process.exit();
      return;
    }

    // Categorize vendors
    const vendorsWithSalesman = vendors.filter(vendor => vendor.salesman_id);
    const vendorsWithoutSalesman = vendors.filter(vendor => !vendor.salesman_id);

    console.log("✅ VENDORS WITH SALESMAN:");
    console.log("=" .repeat(50));
    if (vendorsWithSalesman.length > 0) {
      vendorsWithSalesman.forEach((vendor, index) => {
        console.log(`${index + 1}. ${vendor.name}`);
        console.log(`   📧 Email: ${vendor.email}`);
        console.log(`   👤 Salesman: ${vendor.salesman_id?.name || 'N/A'}`);
        console.log(`   🏢 Vendor Group: ${vendor.vendor_group_id?.name || 'N/A'}`);
        console.log(`   📱 Mobile: ${vendor.mobile || 'N/A'}`);
        console.log("");
      });
    } else {
      console.log("   No vendors have salesman assigned.\n");
    }

    console.log("❌ VENDORS WITHOUT SALESMAN:");
    console.log("=" .repeat(50));
    if (vendorsWithoutSalesman.length > 0) {
      vendorsWithoutSalesman.forEach((vendor, index) => {
        console.log(`${index + 1}. ${vendor.name}`);
        console.log(`   📧 Email: ${vendor.email}`);
        console.log(`   🏢 Vendor Group: ${vendor.vendor_group_id?.name || 'N/A'}`);
        console.log(`   📱 Mobile: ${vendor.mobile || 'N/A'}`);
        console.log("");
      });
    } else {
      console.log("   All vendors have salesman assigned! ✅\n");
    }

    // Summary
    console.log("📈 SUMMARY:");
    console.log("=" .repeat(30));
    console.log(`Total Vendors: ${vendors.length}`);
    console.log(`With Salesman: ${vendorsWithSalesman.length} (${((vendorsWithSalesman.length / vendors.length) * 100).toFixed(1)}%)`);
    console.log(`Without Salesman: ${vendorsWithoutSalesman.length} (${((vendorsWithoutSalesman.length / vendors.length) * 100).toFixed(1)}%)`);

    if (vendorsWithoutSalesman.length === 0) {
      console.log("\n🎉 All vendors are associated with a salesman!");
    } else {
      console.log(`\n⚠️  ${vendorsWithoutSalesman.length} vendors need salesman assignment.`);
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error checking vendor-salesman associations:", error);
    process.exit(1);
  }
};

checkVendorSalesmanAssociation();