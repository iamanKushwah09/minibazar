const express = require("express");
const router = express.Router();
const { isAuth, optionalAuth } = require("../config/auth");
const {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  addRazorpayOrder,
  createOrderByRazorPay,
} = require("../controller/customerOrderController");

//add a order
router.post("/add", optionalAuth, addOrder);

// create stripe payment intent
router.post("/create-payment-intent", isAuth, createPaymentIntent);

//add razorpay order
router.post("/add/razorpay", isAuth, addRazorpayOrder);

//add a order by razorpay
router.post("/create/razorpay", isAuth, createOrderByRazorPay);

//get a order by id
router.get("/:id", isAuth, getOrderById);

//get all order by a user
router.get("/", isAuth, getOrderCustomer);

module.exports = router;



