const Dispatch = require("../models/dispatch.model");
const OrderDetails = require("../models/orderDetails.model");
const Customer = require("../models/customer.model");
const Item = require("../models/item.model");
const AttributeGroup = require("../models/attribute.model");
const AttributeValue = require("../models/AttributeValue.model");
const DispatchLog = require("../models/dispatchlog.model");
// Create a new order
exports.createDispatch = async (req, res) => {
  try {
    const newDispatch = new Dispatch(req.body);
    const savedDispatch = await newDispatch.save();
    res.status(201).json(savedDispatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get an order by ID
exports.getDispatchById = async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id).exec();
    if (!dispatch)
      return res.status(404).json({ message: "Dispatch not found" });
    res.status(200).json(dispatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an order by ID
exports.updateDispatchById = async (req, res) => {
  try {
    const updatedDispatch = await Dispatch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).exec();
    if (!updatedDispatch)
      return res.status(404).json({ message: "Dispatch not found" });
    res.status(200).json(updatedDispatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an order by ID
exports.deleteDispatchById = async (req, res) => {
  try {
    const deletedDispatch = await Dispatch.findByIdAndDelete(
      req.params.id
    ).exec();
    if (!deletedDispatch)
      return res.status(404).json({ message: "Dispatch not found" });
    res.status(200).json({ message: "Dispatch deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders
exports.getDispatch = async (req, res) => {
  try {
    const dispatches = await Dispatch.find().exec();
    res.status(200).json(dispatches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDispatchItems = async (req, res) => {
  const dispatches1 = await OrderDetails.findOne({
    _id: req.params.order_id,
  }).lean();
  if (!dispatches1) {
    return res.status(404).json({ message: "Order not found" });
  }
  dispatches1.customer = await Customer.findOne({
    _id: dispatches1.customers_id,
  }).lean();
  dispatches1.variant = await Promise.all(
    dispatches1.variant.map(async (outerVariant) => {
      try {
        const item = await Item.findOne({ _id: outerVariant.item_id }).lean();
        if (!item) {
          throw new Error(`Item with ID ${outerVariant.item_id} not found.`);
        }
        const item_attribute = await Promise.all(
          (item.item_attribute?.variant || []).map(async (innerVariant) => {
            let attributeValueData = [];
            // Ensure groupArrSelections exists
            if (innerVariant.groupArrSelections) {
              for (const key in innerVariant.groupArrSelections) {
                if (innerVariant.groupArrSelections.hasOwnProperty(key)) {
                  const value = innerVariant.groupArrSelections[key];
                  const attributeGroup = await AttributeValue.findOne({
                    _id: value,
                  }).lean();
                  // Push attribute group to the array if it exists
                  if (attributeGroup) {
                    attributeValueData.push(attributeGroup);
                  }
                }
              }
            }
            return attributeValueData;
          })
        );
        // Attach the fetched attribute values to the variant
        outerVariant.attributeValue = item_attribute.flat(1);
        outerVariant.name = item.name;
        return outerVariant;
      } catch (error) {
        console.error(error);
        return outerVariant; // Return the variant even in case of an error (optional based on your logic)
      }
    })
  );
  res.status(200).json({ dispatches1 });
};
