import {
  FiGrid,
  FiCompass,
  FiSettings,
  FiSlack,
  FiFileText,
} from "react-icons/fi";
import { FaUserShield , FaLuggageCart, FaShippingFast } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";
import { FaBuildingUser } from "react-icons/fa6";
import { RiCustomerService2Fill } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { MdShowChart } from "react-icons/md";

const sidebar = [
  {
    path: "/dashboard",
    icon: FiGrid,
    name: "Dashboard",
    permission: "view_dashboard",
  },
  {
    path: "/catalogs",
    icon: FiSlack,
    name: "Catalog",
    permission: "view_catalog",
  },
  // {
  //   icon: FiSlack,
  //   name: "Catalog",
  //   permission: "view_catalog",
  //   routes: [
  //     { path: "/products", name: "Products", permission: "view_products" },
  //     // { path: "/categories", name: "Categories", permission: "view_categories" },
  //     { path: "/attributes", name: "Attributes", permission: "view_attributes" },
  //     { path: "/coupons", name: "Coupons", permission: "view_coupons" },
  //   ],
  // },
  {
    path: "/vendor-group",
    icon: FaBuildingUser,
    name: "Vendor Group",
    permission: "view_vendor_groups",
  },
  {
    path: "/vendors",
    icon: RiCustomerService2Fill,
    name: "Vendor",
    permission: "view_customers",
  },
  {
    path: "/sales-man",
    icon: FaUserTie,
    name: "Sales Man",
    permission: "view_sales_man",
  },
  {
    path: "/stock",
    icon: MdShowChart,
    name: "Stock",
    permission: "view_stock",
  },
  {
    icon: BsCart4,
    name: "Item",
    permission: "view_item_groups",
    routes: [
      {
        path: "/item-group",
        name: "Item Group",
        permission: "view_item_groups",
      },
      { path: "/item", name: "Item", permission: "view_items" },
      { path: "/brand", name: "Brand", permission: "view_brands" },
      { path: "/category", name: "Category", permission: "view_categories" },
      { path: "/unit", name: "Unit", permission: "view_units" },
      {
        path: "/attribute-group",
        name: "Attribute group",
        permission: "view_attribute_groups",
      },
      {
        path: "/attribute-value",
        name: "Attribute value",
        permission: "view_attribute_values",
      },
    ],
  },
  {
    // path: "/orders",
    icon: FiCompass,
    name: "Orders",
    permission: "view_orders",
    routes: [
      // { path: "/orders", name: "Customer Orders", permission: "view_orders" },
      {
        path: "/sale-order",
        name: "Sale Order",
        permission: "view_sale_order",
      },
    ],
  },
  {
    icon: FiFileText,
    name: "Reports",
    permission: "view_report",
    routes: [
      {
        path: "/party-ledger",
        name: "PartyLedger",
        permission: "view_party_ledger",
      },
      {
        path: "/bill-receivable",
        name: "BillReceivable",
        permission: "view_party_ledger",
      },
    ],
  },

  // {
  //   icon: BiSolidOffer,
  //   name: "Promotion",
  //   permission: "view_item_groups",
  //   routes: [
  //     { path: "/banner", name: "Banner", permission: "view_banners" },
  //     { path: "/offer", name: "Offer", permission: "view_offers" },
  //     { path: "/promo-code", name: "Promo Code", permission: "view_promo_codes" },
  //   ],
  // },
  {
    icon: FaShippingFast,
    name: "Shipping Mgmt",
    permission: "view_shippings",
    routes: [
      { path: "/shipping-settings", name: "Strategy Settings", permission: "view_shippings" },
      { path: "/pharmacy-settings", name: "Pharmacy Location", permission: "view_shippings" },
      { path: "/shipping-rules-list", name: "Shipping Rules", permission: "view_shippings" },
    ],
  },

  {
    path: "/dispatch",
    icon: FaLuggageCart,
    name: "Dispatch",
    permission: "view_dispatchs",
  },
  {
    icon: FaUserShield,
    name: "Administration",
    permission: "view_item_groups",
    routes: [
      { path: "/our-staff", name: "Users", permission: "view_staff" },
      { path: "/role", name: "Role", permission: "view_roles" },
    ],
  },

  // {
  //   path: "/sale-order",
  //   icon: MdPointOfSale,
  //   name: "Sale Order",
  //   permission: "view_sale_order",
  // },
  {
    icon: FiSettings,
    name: "Settings",
    permission: "view_settings",
    routes: [
      { path: "/settings", name: "Settings", permission: "view_settings" },
      {
        path: "/delete-settings",
        name: "Delete Setting",
        permission: "view_settings",
      },
      {
        path: "/whatsapp-setting",
        name: "Whatsapp Setting",
        permission: "manage_whatsapp_setting",
      },
    ],
  },
];

// Permissions for the user (example)
const userPermissions = [
  { path: "/dashboard", permission: "view_dashboard" },
  { path: "/products", permission: "view_products" },
  { path: "/categories", permission: "view_categories" },
  { path: "/attributes", permission: "view_attributes" },
  { path: "/coupons", permission: "view_coupons" },
  { path: "/customers", permission: "view_customers" },
  { path: "/orders", permission: "view_orders" },
  { path: "/our-staff", permission: "view_our_staff" }, // Fixed permission
  {
    path: "/settings?settingTab=common-settings",
    permission: "manage_settings",
  },
  { path: "/whatsapp-setting", permission: "manage_whatsapp_setting" },
  { path: "/delete-settings", permission: "manage_delete_settings" },
  { path: "#", permission: "view_international" },
  { path: "/languages", permission: "view_languages" },
  { path: "/currencies", permission: "view_currencies" },
  { path: "http://localhost:3000", permission: "view_store" },
  { path: "/store/customization", permission: "customize_store" },
  { path: "/store/store-settings", permission: "manage_store_settings" },
  { path: "/catalogs", permission: "view_catalog" },
  { path: "/sale-order", permission: "view_sale_order" },
  { path: "/party-ledger", permission: "view_party_ledger" },
  { path: "/bill-receivable", permission: "view_party_ledger" },
  { path: "#", permission: "view_report" },
  { path: "#", permission: "view_shippings" },
];

const filterSidebar = (sidebar, userPermissions) => {
  return sidebar.filter((item) => {
    const hasPermission = item.permission
      ? userPermissions.some((perm) => perm.permission === item.permission)
      : true;

    if (item.routes) {
      item.routes = filterSidebar(item.routes, userPermissions);
      return hasPermission || item.routes.length > 0;
    }
    return hasPermission;
  });
};

// Final filtered sidebar based on user permissions
// const filteredSidebar = filterSidebar(sidebar, userPermissions);
const getFilteredSidebar = (userPermissions) =>
  filterSidebar(sidebar, userPermissions);
export default getFilteredSidebar;
