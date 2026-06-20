import DeleteSettings from "@/pages/DeleteSettings";
import { lazy } from "react";
// Lazy load your components as before
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Attributes = lazy(() => import("@/pages/Attributes"));
const ChildAttributes = lazy(() => import("@/pages/ChildAttributes"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Category = lazy(() => import("@/pages/Category"));
const ChildCategory = lazy(() => import("@/pages/ChildCategory"));
const Staff = lazy(() => import("@/pages/Staff"));
const Customers = lazy(() => import("@/pages/Customers"));
const CustomerOrder = lazy(() => import("@/pages/CustomerOrder"));
const Orders = lazy(() => import("@/pages/Orders"));
const OrderInvoice = lazy(() => import("@/pages/OrderInvoice"));
const Coupons = lazy(() => import("@/pages/Coupons"));
const Page404 = lazy(() => import("@/pages/404"));
const ComingSoon = lazy(() => import("@/pages/ComingSoon"));
const EditProfile = lazy(() => import("@/pages/EditProfile"));
const Languages = lazy(() => import("@/pages/Languages"));
const Currencies = lazy(() => import("@/pages/Currencies"));
const Setting = lazy(() => import("@/pages/Setting"));
const StoreHome = lazy(() => import("@/pages/StoreHome"));
const StoreSetting = lazy(() => import("@/pages/StoreSetting"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Role = lazy(() => import("@/pages/Role"));
const VendorGroup = lazy(() => import("@/pages/VendorGroup"));
const ItemGroup = lazy(() => import("@/pages/ItemGroup"));
const Item = lazy(() => import("@/pages/Item"));
const Brand = lazy(() => import("@/pages/Brand"));
const Offer = lazy(() => import("@/pages/Offer"));
const Shipping = lazy(() => import("@/pages/Shipping"));
const Unit = lazy(() => import("@/pages/Unit"));
const Banner = lazy(() => import("@/pages/Banner"));
const PromoCode = lazy(() => import("@/pages/PromoCode"));
const AttributeGroup = lazy(() => import("@/pages/AttributeGroup"));
const AttributeValue = lazy(() => import("@/pages/AttributeValue"));
const CataLog = lazy(() => import("@/pages/Catalog"));
const Dispatch = lazy(() => import("@/pages/Dispatch"));
const Stock = lazy(() => import("@/pages/Stock"));
const POS = lazy(() => import("@/pages/POS"));
const SalesMan = lazy(() => import("@/pages/SalesMan"));
const PartyLedger = lazy(() => import("@/pages/PartyLedger"));
const SaleOrder = lazy(() => import("@/pages/SaleOrder"));
const BillReceivable = lazy(() => import("@/pages/BillReceivable"));
const WhatsappSetting = lazy(() => import("@/pages/WhatsappSetting"));

const ShippingSettings = lazy(() => import("@/pages/Shipping/ShippingSettings"));
const PharmacySettings = lazy(() => import("@/pages/Shipping/PharmacySettings"));
const ShippingRulesList = lazy(() => import("@/pages/Shipping/ShippingRulesList"));
const AddShippingRule = lazy(() => import("@/pages/Shipping/AddShippingRule"));


// Define your routes
const allRoutes = [
  { path: "/dashboard", component: Dashboard, permission: "view_dashboard" },
  { path: "/products", component: Products, permission: "view_products" },
  { path: "/attributes", component: Attributes, permission: "view_attributes" },
  { path: "/attributes/:id", component: ChildAttributes, permission: "view_attributes" },
  { path: "/product/:id", component: ProductDetails, permission: "view_products" },
  // { path: "/categories", component: Category, permission: "view_categories" },
  { path: "/category", component: Category, permission: "view_categories" },
  { path: "/languages", component: Languages, permission: "view_languages" },
  { path: "/currencies", component: Currencies, permission: "view_currencies" },
  // { path: "/categories/:id", component: ChildCategory, permission: "view_categories" },
  { path: "/vendors", component: Customers, permission: "view_customers" },
  { path: "/customer-order/:id", component: CustomerOrder, permission: "view_orders" },
  { path: "/our-staff", component: Staff, permission: "view_staff" },
  { path: "/role", component: Role, permission: "view_roles" },
  { path: "/vendor-group", component: VendorGroup, permission: "view_vendor_groups" },
  { path: "/item-group", component: ItemGroup, permission: "view_item_groups" },
  { path: "/item", component: Item, permission: "view_items" },
  { path: "/brand", component: Brand, permission: "view_brands" },
  { path: "/offer", component: Offer, permission: "view_offers" },
  { path: "/shipping", component: Shipping, permission: "view_shippings" },
  { path: "/shipping-settings", component: ShippingSettings, permission: "view_shippings" },
  { path: "/pharmacy-settings", component: PharmacySettings, permission: "view_shippings" },
  { path: "/shipping-rules-list", component: ShippingRulesList, permission: "view_shippings" },
  { path: "/shipping-rules/add", component: AddShippingRule, permission: "view_shippings" },
  { path: "/unit", component: Unit, permission: "view_units" },
  { path: "/banner", component: Banner, permission: "view_banners" },
  { path: "/promo-code", component: PromoCode, permission: "view_promo_codes" },
  { path: "/attribute-group", component: AttributeGroup, permission: "view_attribute_groups" },
  { path: "/attribute-value", component: AttributeValue, permission: "view_attribute_values" },
  { path: "/orders", component: Orders, permission: "view_orders" },
  { path: "/order/:id", component: OrderInvoice, permission: "view_orders" },
  { path: "/coupons", component: Coupons, permission: "view_coupons" },
  { path: "/settings", component: Setting, permission: "view_settings" },
  {path: "/delete-settings", component: DeleteSettings, permission: "view_settings"},
  { path: "/store/customization", component: StoreHome, permission: "view_store" },
  { path: "/store/store-settings", component: StoreSetting, permission: "view_store" },
  { path: "/404", component: Page404 },
  { path: "/coming-soon", component: ComingSoon },
  { path: "/edit-profile", component: EditProfile, permission: "edit_profile" },
  { path: "/notifications", component: Notifications, permission: "view_notifications" },
  { path: "/catalogs", component: CataLog, permission: "view_catalog" },
  { path: "/dispatch", component: Dispatch, permission: "view_dispatchs" },
  { path: "/sales-man", component: SalesMan, permission: "view_sales_man" },
  { path: "/stock", component: Stock, permission: "view_stock" },
  { path: "/pos", component: POS, permission: "view_pos" },
  { path: "/sale-order", component: SaleOrder, permission: "view_sale_order" },
  { path: "/party-ledger", component: PartyLedger, permission: "view_party_ledger" },
  { path: "/bill-receivable", component: BillReceivable, permission: "view_party_ledger" },
  { path: "/whatsapp-setting", component: WhatsappSetting, permission: "manage_whatsapp_setting" },
  { path: "/party-ledger", component: PartyLedger, permission: "view_party_ledger" },
  // { path: "/bill-receivable", component: BillReceivable, permission: "view_party_ledger" },
  // { path: "/whatsapp-setting", component: WhatsappSetting, permission: "manage_whatsapp_setting" },
  // { path: "/party-ledger", component: PartyLedger, permission: "view_party_ledger" },
  // { path: "/bill-receivable", component: BillReceivable, permission: "view_party_ledger" },
  // { path: "/whatsapp-setting", component: WhatsappSetting, permission: "manage_whatsapp_setting" },
  


  // { path: "/settings?settingTab=common-settings", component: Settings , permission: "manage_settings" },
];


// // Assume you have a function to get user permissions
// const getUserPermissions = () => {
//   return [
//     { path: "/dashboard", permission: "view_dashboard" },
//     { path: "/products", permission: "view_products" },
//     { path: "/attributes", permission: "view_attributes" },
//     { path: "/attributes/:id", permission: "view_attributes" },
//     { path: "/product/:id", permission: "view_products" },
//     { path: "/categories", permission: "view_categories" },
//     { path: "/languages", permission: "view_languages" },
//     { path: "/currencies", permission: "view_currencies" },
//     { path: "/categories/:id", permission: "view_categories" },
//     { path: "/customers", permission: "view_customers" },
//     { path: "/customer-order/:id", permission: "view_orders" },
//     { path: "/our-staff", permission: "view_staff" },
//     { path: "/role", permission: "view_roles" },
//     { path: "/orders", permission: "view_orders" },
//     { path: "/order/:id", permission: "view_orders" },
//     { path: "/coupons", permission: "view_coupons" },
//     { path: "/settings", permission: "view_settings" },
//     { path: "/store/customization", permission: "view_store" },
//     { path: "/store/store-settings", permission: "view_store" },
//     { path: "/404", permission: "view_404" },
//     { path: "/coming-soon", permission: "view_comming_soon" },
//     { path: "/edit-profile", permission: "edit_profile" },
//     { path: "/notifications", permission: "view_notifications" }
//   ];
// };

// Filter routes based on user permissions
const filterRoutesByPermissions = (routes, userPermissions) => {
  return routes.reduce((filtered, route) => {
    const hasPermission = userPermissions?.some(
      (userPerm) => userPerm.permission === route.permission
    );
    // If the route does not have a permission, add it directly
    if (!route.permission || hasPermission) {
      filtered.push(route);
    }
    return filtered;
  }, []);
};
// Get user permissions
// const userPermissions = getUserPermissions();
// const routes = filterRoutesByPermissions(allRoutes, userPermissions);
const getRoutes = (userPermissions) => filterRoutesByPermissions(allRoutes, userPermissions);
export default getRoutes;