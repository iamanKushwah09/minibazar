const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  sendOtp,
  verifyOtp,
} = require("../controller/adminController");
const { getDashboardData } = require("../controller/saleorder.controller");
const { passwordVerificationLimit, otpLimit } = require("../lib/email-sender/sender");

//register a staff
router.post("/register", registerAdmin);

//login a admin
router.post("/login", loginAdmin);

//send otp
router.post("/send-otp", otpLimit, sendOtp);

//verify otp
router.post("/verify-otp", verifyOtp);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

//add a staff
router.post("/add", addStaff);

//get all staff
router.get("/", getAllStaff);

//get a staff
router.post("/:id", getStaffById);

//update a staff
router.put("/:id", updateStaff);

//update staf status
router.put("/update-status/:id", updatedStatus);

//delete a staff
router.delete("/:id", deleteStaff);

//dashboard data
router.get("/dashboard", getDashboardData);

module.exports = router;

