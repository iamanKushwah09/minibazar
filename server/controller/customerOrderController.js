require("dotenv").config();
const stripe = require("stripe");
const Razorpay = require("razorpay");
// const stripe = require("stripe")(`${process.env.STRIPE_KEY}` || null); /// use hardcoded key if env not work
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Setting = require("../models/Setting");
const { handleProductQuantity } = require("../lib/stock-controller/others");
const { formatAmountForStripe } = require("../lib/stripe/stripe");
const orderDetailsModel = require("../models/orderDetails.model");
const Customer = require('../models/customer.model');
const SaleOrder = require('../models/saleorder.model');
const SaleType = require('../models/SaleType.model');
const Salesman = require('../models/Sales.model');

// Function to add a new order
const addOrder = async (req, res) => {
  // If the user is logged in, req.user will be defined. Otherwise, it will fall back to guest flow.
  if (!req.user) {
    console.log("addOrder - Guest checkout flow triggered");
  } else {
    console.log("addOrder - Logged-in user checkout flow triggered for ID:", req.user._id);
  }
  try {
    let {
      cart = [],
      paymentMethod = "Cash",
      shippingCost = 0,
      total = 0,
      subTotal = 0,
      discount = 0,
      invoice = null,
      shippingOption = "UPS",
      user_info = {},
    } = req.body;

    // Round numerical amounts to 2 decimal places to prevent floating point precision issues
    total = Math.round(Number(total) * 100) / 100;
    subTotal = Math.round(Number(subTotal) * 100) / 100;
    discount = Math.round(Number(discount) * 100) / 100;
    shippingCost = Math.round(Number(shippingCost) * 100) / 100;
    
    // Quantity validation removed to allow any quantity.

    let customerId;
    let customer;

    if (req.user && req.user._id) {
      customerId = req.user._id;
      // Validate customer exists first
      if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid customer ID format"
        });
      }
      
      customer = await Customer.findById(customerId).select("shippingAddress group_type salesman_id name code");
      
      if (!customer) {
        return res.status(404).json({
          status: "error",
          message: "Customer not found"
        });
      }
    } else {
      // Guest flow
      const name = user_info.name || "Guest Customer";
      const contact = user_info.contact || "";
      const address = user_info.address || "";
      const remarks = user_info.remarks || "";

      if (!contact) {
        return res.status(400).json({
          status: "error",
          message: "Phone number is required for guest checkout."
        });
      }

      // Check if customer exists by mobile
      customer = await Customer.findOne({ mobile: contact });
      if (!customer) {
        // Create a new guest customer
        customer = new Customer({
          name: name,
          mobile: contact,
          address: address,
          shipping_address: address,
          remarks: remarks || null,
          is_guest: true,
          group_type: "Customer",
          is_active: true,
          shippingAddress: {
            name: name,
            address: address,
            contact: contact,
            city: user_info.city || "",
            state: user_info.state || "",
            zipCode: user_info.zipCode || "",
            country: user_info.country || "",
          }
        });
        await customer.save();
      } else {
        // Update guest info if it's a guest customer
        if (customer.is_guest) {
          customer.name = name;
          customer.address = address;
          customer.shipping_address = address;
          customer.remarks = remarks || customer.remarks;
          customer.shippingAddress = {
            name: name,
            address: address,
            contact: contact,
            city: user_info.city || "",
            state: user_info.state || "",
            zipCode: user_info.zipCode || "",
            country: user_info.country || "",
          };
          await customer.save();
        }
      }
      customerId = customer._id.toString();
    }

    let savedOrder;
    
    // If customer is a vendor, create sale order instead of customer order
    if (customer && (customer.group_type === "vendor" || customer.group_type === "Vendor")) {
      try {
        console.log('Creating sale order for vendor:', customer.name);
        // Get default sale type (Central-12%)
        let defaultSaleType = await SaleType.findOne({ 
          name: "I/GST-5%", 
          status: 'active' 
        }) || await SaleType.findOne({ status: 'active' });

        if (!defaultSaleType) {
          defaultSaleType = new SaleType({
            code: 1,
            name: "I/GST-5%",
            status: 'active'
          });
          await defaultSaleType.save();
          console.log("Created default SaleType:", defaultSaleType.name);
        }
        
        let salesmanId = customer.salesman_id;
        if (!salesmanId) {
          let defaultSalesman = await Salesman.findOne({ name: "General" }) || await Salesman.findOne();
          if (!defaultSalesman) {
            defaultSalesman = new Salesman({
              name: "General",
              code: 1,
              is_active: true
            });
            await defaultSalesman.save();
            console.log("Created default Salesman:", defaultSalesman.name);
          }
          salesmanId = defaultSalesman._id;
        }

        console.log('Default sale type found:', defaultSaleType);
        console.log('Using salesman ID:', salesmanId);
        
        if (defaultSaleType && salesmanId) {
          // Transform cart items for sale order
          const saleOrderItems = cart.map(item => {
            // Extract base ObjectId (before any hyphen)
            const baseId = (item._id || item.id || "").split('-')[0];
            if (!mongoose.Types.ObjectId.isValid(baseId)) {
              throw new Error(`Invalid itemId for sale order: ${item._id || item.id}`);
            }

            let itemImage = '';
            if (item.image) {
              if (Array.isArray(item.image)) {
                let temp = item.image;
                while (Array.isArray(temp) && temp.length > 0) {
                  temp = temp[0];
                }
                itemImage = typeof temp === 'string' ? temp : '';
              } else if (typeof item.image === 'string') {
                itemImage = item.image;
              }
            }

            return {
              itemId: baseId,
              name: item.title,
              image: itemImage,
              listPrice: item.originalPrice || item.price,
              price: item.price,
              quantity: item.quantity,
              unit: item.unit || 'PCS',
              conversion_factor: 1,
              discount: item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice * 100) * 100) / 100 : 0,
              totalDiscount: item.originalPrice ? Math.round((item.originalPrice - item.price) * item.quantity * 100) / 100 : 0,
              amount: Math.round(Number(item.itemTotal) * 100) / 100,
              color: item.color || '',
              size: item.size || ''
            };
          });

          const saleOrder = new SaleOrder({
            saleType: defaultSaleType._id,
            saleTypeCode: defaultSaleType.code.toString(),
            matCentre: 'MAIN',
            date: new Date(),
            customer: customerId,
            customerCode: customer.code || '',
            salesman: salesmanId,
            salesmanCode: '',
            items: saleOrderItems,
            netAmount: subTotal,
            totalAmount: total,
            totalDiscountAmount: discount,
            totalQuantity: cart.reduce((acc, item) => acc + item.quantity, 0)
          });

          const savedSaleOrder = await saleOrder.save();
          console.log(`Sale order created for vendor: ${customer.name}`);
          
          // Create a mock order object for response consistency
          savedOrder = {
            _id: savedSaleOrder._id,
            order_no: `SO-${savedSaleOrder._id.toString().slice(-6).toUpperCase()}`,
            customers_id: customerId,
            status: 'Dispatched', // Vendors go directly to dispatch
            order_date: savedSaleOrder.date,
            invoice: invoice,
            description: `Vendor Order - Customer: ${user_info.name}, Phone: ${user_info.contact}, City: ${user_info.city}, Address: ${user_info.address}, Zip: ${user_info.zipCode}`,
            createdAt: savedSaleOrder.createdAt,
            updatedAt: savedSaleOrder.updatedAt
          };
        } else {
          throw new Error('Default sale type or salesman not found for vendor');
        }
      } catch (saleOrderError) {
        console.error('Error creating sale order:', saleOrderError);
        return res.status(500).json({
          status: "error",
          message: "Failed to create sale order for vendor",
          error: saleOrderError.message
        });
      }
    } else {
      // For regular customers, create normal customer order
      const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const newOrder = new orderDetailsModel({
        variant: cart,
        order_date: new Date().toISOString(),
        order_no: orderNumber,
        status: "Start",
        payment_mode: paymentMethod,
        shipping_charge: shippingCost,
        total_amount: total,
        total_qty: cart.reduce((acc, item) => acc + item.quantity, 0),
        description: `Customer: ${user_info.name}, Phone: ${user_info.contact}, City: ${user_info.city}, Address: ${user_info.address}, Zip: ${user_info.zipCode}`,
        is_active: true,
        customers_id: customerId,
        customers_type: "Customer",
        shippingOption,
        paymentMethod,
        subTotal,
        discount,
        invoice,
      });
      console.log('Saving customer order to database...');
      savedOrder = await newOrder.save();
      console.log('Customer order saved successfully:', savedOrder._id);

      // Create matching SaleOrder for admin visibility
      try {
        let defaultSaleType = await SaleType.findOne({ 
          name: "I/GST-5%", 
          status: 'active' 
        }) || await SaleType.findOne({ status: 'active' });

        if (!defaultSaleType) {
          defaultSaleType = new SaleType({
            code: 1,
            name: "I/GST-5%",
            status: 'active'
          });
          await defaultSaleType.save();
          console.log("Created default SaleType for customer order:", defaultSaleType.name);
        }

        let salesmanId = customer.salesman_id;
        if (!salesmanId) {
          let defaultSalesman = await Salesman.findOne({ name: "General" }) || await Salesman.findOne();
          if (!defaultSalesman) {
            defaultSalesman = new Salesman({
              name: "General",
              code: 1,
              is_active: true
            });
            await defaultSalesman.save();
            console.log("Created default Salesman for customer order:", defaultSalesman.name);
          }
          salesmanId = defaultSalesman._id;
        }

        const saleOrderItems = cart.map(item => {
          const baseId = (item._id || item.id || "").split('-')[0];

          let itemImage = '';
          if (item.image) {
            if (Array.isArray(item.image)) {
              let temp = item.image;
              while (Array.isArray(temp) && temp.length > 0) {
                temp = temp[0];
              }
              itemImage = typeof temp === 'string' ? temp : '';
            } else if (typeof item.image === 'string') {
              itemImage = item.image;
            }
          }

          return {
            itemId: mongoose.Types.ObjectId.isValid(baseId) ? baseId : new mongoose.Types.ObjectId(),
            name: item.title,
            image: itemImage,
            listPrice: item.originalPrice || item.price,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit || 'PCS',
            conversion_factor: 1,
            discount: item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice * 100) * 100) / 100 : 0,
            totalDiscount: item.originalPrice ? Math.round((item.originalPrice - item.price) * item.quantity * 100) / 100 : 0,
            amount: Math.round(Number(item.itemTotal) * 100) / 100,
            color: item.color || '',
            size: item.size || ''
          };
        });

        if (defaultSaleType && salesmanId) {
          const saleOrder = new SaleOrder({
            voucherNo: orderNumber,
            saleType: defaultSaleType._id,
            saleTypeCode: defaultSaleType.code.toString(),
            matCentre: 'MAIN',
            date: new Date(),
            customer: customerId,
            customerCode: customer.code || '',
            salesman: salesmanId,
            salesmanCode: '',
            items: saleOrderItems,
            netAmount: subTotal,
            totalAmount: total,
            totalDiscountAmount: discount,
            totalQuantity: cart.reduce((acc, item) => acc + item.quantity, 0),
            status: "Start",
            description: `Customer Order - ${orderNumber}`
          });

          await saleOrder.save();
          console.log('SaleOrder created for customer order:', saleOrder.voucherNo);
        }
      } catch (saleOrderErr) {
        console.error("Error creating matching SaleOrder for customer order:", saleOrderErr);
      }
    }

    // Construct the final order response
    const orderResponse = {
      _id: savedOrder._id,
      order_no: savedOrder.order_no,
      user: savedOrder.customers_id,
      user_info: customer?.shippingAddress || {},
      cart,
      subTotal,
      shippingCost,
      discount,
      total,
      shippingOption,
      paymentMethod,
      status: savedOrder.status,
      orderDate: savedOrder.order_date,
      invoice: savedOrder.invoice,
      description: savedOrder.description,
      createdAt: savedOrder.createdAt,
      updatedAt: savedOrder.updatedAt,
      orderType: (customer.group_type === "vendor" || customer.group_type === "Vendor") ? "sale_order" : "customer_order"
    };
    // Respond to client
    res.status(201).json(orderResponse);
    // Decrement product quantities (async, fire-and-forget)
    handleProductQuantity(cart);
  } catch (err) {
    console.error("Error adding order:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error while adding order",
      error: err.message,
    });
  }
};


//create payment intent for stripe
const createPaymentIntent = async (req, res) => {
  const { total: amount, cardInfo: payment_intent, email } = req.body;
  // console.log("req.body", amount);
  // Validate the amount that was passed from the client.
  if (!(amount >= process.env.MIN_AMOUNT && amount <= process.env.MAX_AMOUNT)) {
    return res.status(500).json({ message: "Invalid amount." });
  }
  const storeSetting = await Setting.findOne({ name: "storeSetting" });
  const stripeSecret = storeSetting?.setting?.stripe_secret;
  const stripeInstance = stripe(stripeSecret);
  if (payment_intent.id) {
    try {
      const current_intent = await stripeInstance.paymentIntents.retrieve(
        payment_intent.id
      );
      // If PaymentIntent has been created, just update the amount.
      if (current_intent) {
        const updated_intent = await stripeInstance.paymentIntents.update(
          payment_intent.id,
          {
            amount: formatAmountForStripe(amount, "usd"),
          }
        );
        // console.log("updated_intent", updated_intent);
        return res.send(updated_intent);
      }
    } catch (err) {
      if (err.code !== "resource_missing") {
        const errorMessage =
          err instanceof Error ? err.message : "Internal server error";
        return res.status(500).send({ message: errorMessage });
      }
    }
  }
  try {
    // Create PaymentIntent from body params.
    const params = {
      amount: formatAmountForStripe(amount, "usd"),
      currency: "usd",
      description: process.env.STRIPE_PAYMENT_DESCRIPTION || "",
      automatic_payment_methods: {
        enabled: true,
      },
    };
    const payment_intent = await stripeInstance.paymentIntents.create(params);
    // console.log("payment_intent", payment_intent);

    res.send(payment_intent);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).send({ message: errorMessage });
  }
};

const createOrderByRazorPay = async (req, res) => {
  try {
    const storeSetting = await Setting.findOne({ name: "storeSetting" });
    // console.log("createOrderByRazorPay", storeSetting?.setting);

    const instance = new Razorpay({
      key_id: storeSetting?.setting?.razorpay_id,
      key_secret: storeSetting?.setting?.razorpay_secret,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    if (!order)
      return res.status(500).send({
        message: "Error occurred when creating order!",
      });
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addRazorpayOrder = async (req, res) => {
  try {
    console.log("addRazorpayOrder - req.user:", req.user);
    console.log("addRazorpayOrder - req.body:", req.body);
    
    // Validate user ID format
    if (!req.user._id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid user ID format"
      });
    }
    
    const newOrder = new Order({
      ...req.body,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
    handleProductQuantity(order.cart);
  } catch (err) {
    console.error("Error in addRazorpayOrder:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all orders user
const getOrderCustomer = async (req, res) => {
  try {
   
    
    const { page, limit } = req.query;
    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;
    
    // Validate user ID format
    if (!req.user._id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid user ID format"
      });
    }
    
    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    // Check if user is a vendor
    const customer = await Customer.findById(userId).select("group_type");
    const isVendor = customer && (customer.group_type === "vendor" || customer.group_type === "Vendor");
    
    let orders, totalDoc, totalPendingOrder, totalProcessingOrder, totalDeliveredOrder;
    
    if (isVendor) {
      // For vendors, fetch from sale orders
      totalDoc = await SaleOrder.countDocuments({ customer: userId });
      
      // For vendors, all orders are considered "dispatched" (processing)
      totalPendingOrder = [];
      totalProcessingOrder = await SaleOrder.aggregate([
        {
          $match: {
            customer: userId,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
            count: {
              $sum: 1,
            },
          },
        },
      ]);
      totalDeliveredOrder = [];
      
      // Fetch sale orders and transform to match order format
      const saleOrders = await SaleOrder.find({ customer: userId })
        .populate('saleType', 'name')
        .populate('customer', 'name')
        .populate('salesman', 'name')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limits);
      
      // Transform sale orders to match customer order format
      orders = saleOrders.map(saleOrder => ({
        _id: saleOrder._id,
        order_no: `SO-${saleOrder._id.toString().slice(-6).toUpperCase()}`,
        order_date: saleOrder.date,
        status: "Dispatched", // Vendors go directly to dispatch
        total_amount: saleOrder.totalAmount,
        total_qty: saleOrder.totalQuantity,
        customers_id: saleOrder.customer,
        variant: saleOrder.items.map(item => ({
          id: item.itemId,
          title: item.name,
          image: item.image ? [item.image] : [],
          price: item.price,
          originalPrice: item.listPrice,
          quantity: item.quantity,
          itemTotal: item.amount,
          color: item.color,
          size: item.size
        })),
        description: `Vendor Sale Order`,
        createdAt: saleOrder.createdAt,
        updatedAt: saleOrder.updatedAt
      }));
    } else {
      // For regular customers, use existing logic
      totalDoc = await orderDetailsModel.countDocuments({ customers_id: userId });
      
      totalPendingOrder = await orderDetailsModel.aggregate([
        {
          $match: {
            status: "Start",
            customers_id: userId,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total_amount" },
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      totalProcessingOrder = await orderDetailsModel.aggregate([
        {
          $match: {
            status: "Dispatched",
            customers_id: userId,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total_amount" },
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      totalDeliveredOrder = await orderDetailsModel.aggregate([
        {
          $match: {
            status: "Processing",
            customers_id: userId,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total_amount" },
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      orders = await orderDetailsModel.find({ customers_id: userId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limits);
    }

    res.send({
      orders,
      limits,
      pages,
      pending: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0].count,
      processing:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      delivered:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
      totalDoc,
      orderType: isVendor ? "sale_order" : "customer_order"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    console.log("getOrderById - req.user:", req.user);
    console.log("getOrderById - req.params.id:", req.params.id);
    
    // Validate order ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid order ID format"
      });
    }
    
    // Check if user is a vendor
    const customer = await Customer.findById(req.user._id).select("group_type shippingAddress");
    const isVendor = customer && (customer.group_type === "vendor" || customer.group_type === "Vendor");
    
    let order, orders = {};
    
    if (isVendor) {
      // For vendors, fetch from sale orders
      const saleOrder = await SaleOrder.findById(req.params.id)
        .populate('saleType', 'name')
        .populate('customer', 'name shippingAddress')
        .populate('salesman', 'name');
      
      if (!saleOrder) {
        return res.status(404).json({
          message: "Sale order not found"
        });
      }
      
      // Ensure the sale order belongs to the authenticated user
      if (saleOrder.customer._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Access denied. This sale order does not belong to you."
        });
      }
      
      // Transform sale order to match customer order format
      orders.user_info = customer.shippingAddress;
      orders.cart = saleOrder.items.map(item => ({
        id: item.itemId,
        title: item.name,
        image: item.image ? [item.image] : [],
        price: item.price,
        originalPrice: item.listPrice,
        quantity: item.quantity,
        itemTotal: item.amount,
        color: item.color,
        size: item.size,
        unit: item.unit
      }));
      orders.subTotal = saleOrder.netAmount;
      orders.shippingCost = 0; // Vendors typically don't have shipping costs
      orders.discount = saleOrder.totalDiscountAmount;
      orders.total = saleOrder.totalAmount;
      orders.shippingOption = "Direct Dispatch";
      orders.paymentMethod = "Credit";
      orders.status = "Dispatched";
      orders.orderId = saleOrder._id;
      orders.orderDate = saleOrder.date;
      orders.invoice = null;
      orders.user = saleOrder.customer._id;
      orders._id = saleOrder._id;
      orders.createdAt = saleOrder.createdAt;
      orders.updatedAt = saleOrder.updatedAt;
      orders.description = `Vendor Sale Order - ${saleOrder.saleType?.name || 'Sale'}`;
      orders.order_no = `SO-${saleOrder._id.toString().slice(-6).toUpperCase()}`;
      orders.orderType = "sale_order";
    } else {
      // For regular customers, use existing logic
      order = await orderDetailsModel.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      
      // Ensure the order belongs to the authenticated user
      if (order.customers_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Access denied. This order does not belong to you."
        });
      }
      
      const customerList = await Customer.findById(order.customers_id);
      
      if (!customerList) {
        return res.status(404).json({
          message: "Customer not found"
        });
      }
      
      orders.user_info = customerList.shippingAddress;
      orders.cart = order.variant;
      orders.subTotal = order.subTotal;
      orders.shippingCost = order.shipping_charge;
      orders.discount = order.discount;
      orders.total = order.total_amount;
      orders.shippingOption = order.shippingOption;
      orders.paymentMethod = order.paymentMethod;
      orders.status = order.status;
      orders.orderId = order._id;
      orders.orderDate = order.order_date;
      orders.invoice = order.invoice;
      orders.user = order.customers_id;
      orders._id = order._id;
      orders.createdAt = order.createdAt;
      orders.updatedAt = order.updatedAt;
      orders.description = order.description;
      orders.order_no = order.order_no;
      orders.orderType = "customer_order";
    }
    
    res.send(orders);
  } catch (err) {
    console.log("Error in getOrderById:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  createOrderByRazorPay,
  addRazorpayOrder,
};
