require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
// const http = require("http");
// const { Server } = require("socket.io");
const dotenv = require("dotenv");
const fs = require("fs");

//  swagger openapi import
const swaggerUI = require("swagger-ui-express");
const swaggerDoc = require("../swagger");

// Dynamically determine the environment file to load
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, envFile) });

const { connectDB } = require("../config/db");
const productRoutes = require("../routes/productRoutes");
const customerStoreRoutes = require("../routes/customerRoutes");
const adminRoutes = require("../routes/adminRoutes");
const orderRoutes = require("../routes/orderRoutes");
const customerOrderRoutes = require("../routes/customerOrderRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const couponRoutes = require("../routes/couponRoutes");
const attributeRoutes = require("../routes/attributeRoutes");
const settingRoutes = require("../routes/settingRoutes");
const currencyRoutes = require("../routes/currencyRoutes");
const languageRoutes = require("../routes/languageRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const roleRoutes = require("../routes/roleRoutes");
const locationRoutes = require("../routes/locationRoutes");
const whatsappSetting = require("../routes/whatsappsetting.routes");
const brand = require("../routes/brand.routes");
const units = require("../routes/unit.routes");
const category = require("../routes/category.routes");
const item = require("../routes/item.routes");
const itemGroup = require("../routes/itemGroup.routes");
const itemOffer = require("../routes/offer.routes");
// order
const order = require("../routes/order.routes");
const orderDetails = require("../routes/orderDetails.routes");
// start-attribute
const attributeGroupRoutes = require("../routes/attribute.routes");
const attributeValueRoutes = require("../routes/attributeValue.routes");
const productAttribute = require("../routes/productAttribute.routes");
// end-attribute
const vendorGroupRoutes = require("../routes/vendorGroup.routes");
const vendorSalesmanRoutes = require("../routes/vendorSalesmanRoutes");
const bannerRoutes = require("../routes/banner.routes");
const promoCodeRoutes = require("../routes/promoCode.routes");
const adminShippingRoutes = require("../routes/admin/shipping.route");
const clientShippingRoutes = require("../routes/client/shipping.route");
const shippingRoutes = require("../routes/shipping.routes");
const customerRoutes = require("../routes/customer.routes");
const catalogRoutes = require("../routes/catalog.routes");
const salesmanRoutes = require("../routes/sales.Routes");
const dispatchRoutes = require("../routes/dispatch.routes");
const dispatchLogRoutes = require("../routes/dispatchLog.routes"); // new dispatch log route
const saleOrderRoutes = require("../routes/saleorder.routes");
const saleTypeRoutes = require("../routes/saleType.routes");
const sundryDiscountRoutes = require("../routes/sundryDiscountRoutes");
const itemDiscountRoutes = require("../routes/itemDiscountRoutes");
const billSundryRoutes = require("../routes/billSundryRoutes");
// const { startCron } = require("../cron");
// startCron();
const itemGroupRoute = require("../routes/itemGroupRoute");

const { isAuth, isAdmin } = require("../config/auth");
const WhatsappSettingModel = require("../models/WhatsappSetting.model");
// const {
//   getGlobalSetting,
//   getStoreCustomizationSetting,
// } = require("../lib/notification/setting");

connectDB();
const app = express();

// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
// app.enable('trust proxy');
app.set("trust proxy", 1);

app.use(express.json({ limit: "40mb" }));
// swagger used
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" }
// }));
// app.options("*", cors()); // include before other routes
// app.use(cors());

// CORS configuration with specific origins for security
const allowedOrigins = [
  "https://minibazar.in",
  "https://www.minibazar.in",
  "https://admin.minibazar.in",
  "https://api.minibazar.in",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3005",
  "http://localhost:3101",
  "http://localhost:4100",
  "http://localhost:5055",
  "http://localhost:5058",
  "http://localhost:5173",
  "http://localhost:4105",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("🔐 CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  }),
);

// app.use(cors({
//   origin: 'https://admin.selectionfootwear.com'
// }));

// Set EJS as the view engine
app.set("view engine", "ejs");
// Set the directory for EJS templates - more robust path resolution
const viewsPath =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "views")
    : path.join(__dirname, "../views");
app.set("views", viewsPath);
console.log("Views directory set to:", viewsPath);

//root route
app.get("/", (req, res) => {
  res.send("App works properly!");
});

//this for route will need for store front, also for admin dashboard
app.use("/api/products/", productRoutes);
// app.use("/api/category/", categoryRoutes);
app.use("/api/categories/", categoryRoutes); // this api name changed
app.use("/api/coupon/", couponRoutes);
app.use(
  "/api/store/customer/",
  (req, res, next) => {
    console.log("🔐 Step 7: api/index.js - Store customer route hit");
    console.log("🔐 Full URL:", req.originalUrl);
    console.log("🔐 Method:", req.method);
    console.log("🔐 Path:", req.path);
    next();
  },
  customerStoreRoutes,
);
app.use("/api/order/", customerOrderRoutes);
app.use("/api/attributes/", attributeRoutes);
app.use("/api/setting/", settingRoutes);
app.use("/api/whatsapp-setting/", isAuth, whatsappSetting);
app.use("/api/currency/", isAuth, currencyRoutes);
app.use("/api/language/", languageRoutes);
app.use("/api/notification/", isAuth, notificationRoutes);
app.use("/api/role/", roleRoutes);
app.use("/api/location/", locationRoutes);
app.use("/api/brand", brand);
app.use("/api/unit", units);
app.use("/api/category", category);
app.use("/api/items", item);
app.use("/api/item-groups", itemGroup);
app.use("/api/item-offer", itemOffer);
app.use("/api/orders", order);
app.use("/api/order-details", orderDetails);
app.use("/api/attribute-group", attributeGroupRoutes);
app.use("/api/attribute-value", attributeValueRoutes);
app.use("/api/product-attribute", productAttribute);
app.use("/api/vendor-group", vendorGroupRoutes);
app.use("/api/vendor-salesman", vendorSalesmanRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/promo-code", promoCodeRoutes);
app.use("/api/admin/shipping", adminShippingRoutes);
app.use("/api/shipping", clientShippingRoutes);
app.use("/api/legacy-shipping", shippingRoutes); // Renamed legacy route to avoid conflict
app.use("/api/customer", customerRoutes);
app.use("/api/dispatch", dispatchRoutes);
app.use("/api/dispatchlog", dispatchLogRoutes); // new dispatch log route
//if you not use admin dashboard then these two route will not needed.
app.use("/api/admin/", adminRoutes);
app.use("/api/orders/", orderRoutes);
app.use("/api/salesman", salesmanRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/sundry-discount", sundryDiscountRoutes);
app.use("/api/item-discount", itemDiscountRoutes);
app.use("/api/bill-sundry", billSundryRoutes);
app.use("/api/sale-order", saleOrderRoutes);
app.use("/api/sale-type", saleTypeRoutes);
app.use("/api/item-groups-route", itemGroupRoute);
app.use("/api/sync", require("../routes/sync.routes"));

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

// Serve static files from the "dist" directory
app.use("/static", express.static("public"));
app.use("/", express.static(path.join(__dirname, process.env.FILE_UPLOAD_FOLDER || "../uploadFile_masale")));
// Route to serve files properly with a base path for images and others
app.get("/api/static/:folder/:filename", (req, res) => {
  const { folder, filename } = req.params;
  const filePath = path.join(
    __dirname,
    process.env.FILE_UPLOAD_FOLDER || "../uploadFile_masale",
    folder,
    filename,
  );

  // console.log('Static file request:--', { folder, filename, filePath });
  // console.log('File exists:--', fs.existsSync(filePath));

  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log("File not found:", filePath);
    res.status(404).json({ error: "File not found", path: filePath });
  }
});

// Serve the index.html file for all routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

const PORT = process.env.PORT || 5056;

// const server = http.createServer(app);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// set up socket
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:4100",
//       "https://admin-kachabazar.vercel.app",
//       "https://dashtar-admin.vercel.app",
//       "https://kachabazar-store.vercel.app",
//       "https://kachabazar-admin.netlify.app",
//       "https://dashtar-admin.netlify.app",
//       "https://kachabazar-store-nine.vercel.app",
//     ], //add your origin here instead of this
//     methods: ["PUT", "GET", "POST", "DELETE", "PATCH", "OPTIONS"],
//     credentials: false,
//     transports: ["websocket"],
//   },
// });

// io.on("connection", (socket) => {
//   // console.log(`Socket ${socket.id} connected!`);

//   socket.on("notification", async (data) => {
//     console.log("data", data);
//     try {
//       let updatedData = data;

//       if (data?.option === "storeCustomizationSetting") {
//         const storeCustomizationSetting = await getStoreCustomizationSetting(
//           data
//         );
//         updatedData = {
//           ...data,
//           storeCustomizationSetting: storeCustomizationSetting,
//         };
//       }
//       if (data?.option === "globalSetting") {
//         const globalSetting = await getGlobalSetting(data);
//         updatedData = {
//           ...data,
//           globalSetting: globalSetting,
//         };
//       }
//       io.emit("notification", updatedData);
//     } catch (error) {
//       console.error("Error handling notification:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`Socket ${socket.id} disconnected!`);
//   });
// });
// server.listen(PORT, () => console.log(`server running on port ${PORT}`));
