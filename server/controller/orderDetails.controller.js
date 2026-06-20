// controllers/orderDetails.controller.js
const OrderDetails = require("../models/orderDetails.model");
const DispatchLog = require("../models/dispatchlog.model");
const fileUploadHelper = require('../fileUploader/fileUploadHelper');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum");

// Create new Order Details
exports.createOrderDetails = async (req, res) => {
  try {
    const newOrderDetails = new OrderDetails(req.body);
    // const newOrderDetails = new OrderDetails({
    //   ...req.body,
    //   _id: req.body._id ?? null,
    //   orderId: req.body.orderId ?? null,
    //   user: req.body.user ?? null,
    //   cart: req.body.cart?.map(item => ({
    //     productId: item.productId ?? '',
    //     title: item.title ?? '',
    //     image: item.image ?? '',
    //     quantity: item.quantity ?? 0,
    //     price: item.price ?? 0,
    //     originalPrice: item.originalPrice ?? 0,
    //     discount: item.discount ?? 0
    //   })) ?? [],
    //   variants: req.body.variants ?? [],
    //   prices: {
    //     price: req.body.total ?? 0,
    //     originalPrice: req.body.total ?? 0,
    //     discount: req.body.discount ?? 0
    //   },
    //   shippingAddress: {
    //     firstName: req.body.shippingAddress?.firstName ?? '',
    //     lastName: req.body.shippingAddress?.lastName ?? '',
    //     address: req.body.shippingAddress?.address ?? '',
    //     city: req.body.shippingAddress?.city ?? '',
    //     country: req.body.shippingAddress?.country ?? '',
    //     zipCode: req.body.shippingAddress?.zipCode ?? '',
    //   },
    //   subTotal: req.body.subTotal ?? 0,
    //   shippingCost: req.body.shippingCost ?? 0,
    //   discount: req.body.discount ?? 0,
    //   total: req.body.total ?? 0,
    //   shippingOption: req.body.shippingOption ?? '',
    //   paymentMethod: req.body.paymentMethod ?? 'COD',
    //   cardInfo: req.body.cardInfo ?? {},
    //   status: req.body.status ?? "Pending",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   __v: req.body.__v ?? 0
    // });
    const orderDetails = await newOrderDetails.save();
    res.status(201).json(orderDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Order Details
exports.getAllOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDetails.find();
    res.status(200).json(orderDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Order Details by ID
exports.getOrderDetailsById = async (req, res) => {
  try {
    const orderDetail = await OrderDetails.findById(req.params.id);
    if (!orderDetail)
      return res.status(404).json({ message: "Order Details not found" });
    res.status(200).json(orderDetail);
    console.log(orderDetail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Order Details by ID
exports.updateOrderDetailsById = async (req, res) => {
  try {
    const updated = await OrderDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Order Details not found" });

    // Create a dispatch log entry when dispatch-related fields are updated
    const { status, updateDescription, grNo, lot, images } = req.body || {};

    try {
       // Assuming `req.body.image` is an array of image objects
      if (!Array.isArray(images)) {
        return res
          .status(400)
          .json({ message: "Invalid input: `image` should be an array." });
      }
      const uploadedPaths = await Promise.all(
        images
          .filter((image) => image.base64File && image.fileName) // Remove objects with blank or undefined keys
          .map(async (image) => {
            const { base64File, fileName } = image;
            const cleanedBase64File = base64File.split(";base64,").pop();
            // Upload the file
            return await fileUploadHelper.uploadSingleFile(
              `dispatchlog`,
              fileName,
              cleanedBase64File
            );
          })
      );
      // Replace req.body.image with the uploaded paths
      req.body.image = uploadedPaths.length > 0 ? uploadedPaths[0] : "";
      await DispatchLog.create({
        orderDetails_id: updated._id,
        status: status || updated.status || "Start",
        updateDescription: updateDescription || "",
        grNo: grNo || "",
        lot: lot || "",
        images: uploadedPaths,
      });
    } catch (logErr) {
      // Don't fail the main response if log creation fails
      console.error("Failed to create dispatch log:", logErr.message);
    }

    res.status(200).json({ message: `Order ${UPDATE_MESSAGE}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Order Details by ID
exports.deleteOrderDetailsById = async (req, res) => {
  try {
    const orderDetail = await OrderDetails.findByIdAndDelete(req.params.id);
    if (!orderDetail)
      return res.status(404).json({ message: "Order Details not found" });
    res.status(200).json({ message: `Order ${DELETE_MESSAGE}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
