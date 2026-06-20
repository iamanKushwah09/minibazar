require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const Customer = require("../models/Customer");
const Customer = require('../models/customer.model');
const { signInToken, tokenForVerify } = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const { customerRegisterBody } = require("../lib/email-sender/templates/register");
const { forgetPasswordEmailBody } = require("../lib/email-sender/templates/forget-password");
const { ObjectId } = require("mongodb");

const verifyEmailAddress = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });
  if (isAdded) {
    return res.status(403).send({
      message: "This Email already Added!",
    });
  } else {
    const token = tokenForVerify(req.body);
    const option = {
      name: req.body.name,
      email: req.body.email,
      token: token,
    };
    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.email}`,
      subject: "Email Activation",
      subject: "Verify Your Email",
      html: customerRegisterBody(option),
    };
    const message = "Please check your email to verify your account!";
    sendEmail(body, res, message);
  }
};

const registerCustomer = async (req, res) => {
  const token = req.params.token;
  const { name, email, password } = jwt.decode(token);
  const isAdded = await Customer.findOne({ email: email });

  if (isAdded) {
    const token = signInToken(isAdded);
    return res.send({
      token,
      _id: isAdded._id,
      name: isAdded.name,
      email: isAdded.email,
      message: "Email Already Verified!",
    });
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Token Expired, Please try again!",
        });
      } else {
        const newUser = new Customer({
          name,
          email,
          password: bcrypt.hashSync(password),
        });
        newUser.save();
        const token = signInToken(newUser);
        res.send({
          token,
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          message: "Email Verified, Please Login Now!",
        });
      }
    });
  }
};

const addAllCustomers = async (req, res) => {
  try {
    await Customer.deleteMany();
    await Customer.insertMany(req.body);
    res.send({
      message: "Added all users successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginCustomer = async (req, res) => {
 
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
      });
    }
    const customer = await Customer.findOne({ email: email }).populate('vendor_group_id');
    if (!customer) {
      return res.status(401).send({
        message: "Invalid user or password!",
      });
    }
    if (!customer.password) {
      return res.status(401).send({
        message: "Invalid user or password!",
      });
    }
    if (!bcrypt.compareSync(password, customer.password)) {
      console.log('🔐 Step 14: Invalid password for customer:', email);
      return res.status(401).send({
        message: "Invalid user or password!",
      });
    }
    // Generate token
    const token = signInToken(customer);
    const response = {
      token,
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      address: customer.address,
      mobile: customer.mobile,
      image: customer.image,
      group_type: customer.group_type,
      party_group_code:customer?.vendor_group_id?.busy_group_id, 
      getParty:customer.code,
    };
    res.send(response);

  } catch (err) {
    console.error('🔐 === BACKEND CUSTOMER LOGIN ERROR ===');
    console.error('🔐 Step ERROR: Exception occurred in loginCustomer');
    console.error('🔐 Customer login error:', err);
    console.error('🔐 Error stack:', err.stack);
    res.status(500).send({
      message: "Internal server error during login",
    });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.verifyEmail });
  if (!isAdded) {
    return res.status(404).send({
      message: "User Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const option = {
      name: isAdded.name,
      email: isAdded.email,
      token: token,
    };

    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: forgetPasswordEmailBody(option),
    };

    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const customer = await Customer.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        customer.password = bcrypt.hashSync(req.body.newPassword);
        customer.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const changePassword = async (req, res) => {
  try {
    // console.log("changePassword", req.body);
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer.password) {
      return res.status(403).send({
        message:
          "For change password,You need to sign up with email & password!",
      });
    } else if (
      customer &&
      bcrypt.compareSync(req.body.currentPassword, customer.password)
    ) {
      customer.password = bcrypt.hashSync(req.body.newPassword);
      await customer.save();
      res.send({
        message: "Your password change successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email or current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithProvider = async (req, res) => {
  try {
    // const { user } = jwt.decode(req.body.params);
    const user = jwt.decode(req.params.token);

    // console.log("user", user);
    const isAdded = await Customer.findOne({ email: user.email });
    if (isAdded) {
      const token = signInToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        mobile: isAdded.mobile,
        image: isAdded.image,
      });
    } else {
      const newUser = new Customer({
        name: user.name,
        email: user.email,
        image: user.picture,
      });

      const signUpCustomer = await newUser.save();
      const token = signInToken(signUpCustomer);
      res.send({
        token,
        _id: signUpCustomer._id,
        name: signUpCustomer.name,
        email: signUpCustomer.email,
        image: signUpCustomer.image,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithOauthProvider = async (req, res) => {
  try {
    // console.log("user", user);
    // console.log("signUpWithOauthProvider", req.body);
    const isAdded = await Customer.findOne({ email: req.body.email });
    if (isAdded) {
      const token = signInToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        mobile: isAdded.mobile,
        image: isAdded.image,
      });
    } else {
      const newUser = new Customer({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
      });

      const signUpCustomer = await newUser.save();
      const token = signInToken(signUpCustomer);
      res.send({
        token,
        _id: signUpCustomer._id,
        name: signUpCustomer.name,
        email: signUpCustomer.email,
        image: signUpCustomer.image,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, q = "", salesmanId } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Build query object
    const query = {};

    // Add search filter if q is provided
    if (q && q.trim()) {
      query.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { email: { $regex: q.trim(), $options: 'i' } },
        { mobile: { $regex: q.trim(), $options: 'i' } },
        { code: { $regex: q.trim(), $options: 'i' } }
      ];
    }

    // Add salesmanId filter if provided (optional)
    if (salesmanId && salesmanId.trim()) {
      query.salesman_id = salesmanId.trim();
    }

    // Get total count for pagination
    const totalDoc = await Customer.countDocuments(query);

    // Get paginated results
    const customers = await Customer.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Return data in the format expected by the client
    res.send({
      data: customers,
      pagination: {
        total: totalDoc,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(totalDoc / limitNumber)
      }
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ message: "Invalid customer ID format" });
    }
    
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).send({ message: "Customer not found" });
    }
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Shipping address create or update
const addShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;
    
    // Validate ObjectId format
    if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ message: "Invalid customer ID format" });
    }
    
    const newShippingAddress = req.body;
    console.log("newShippingAddress: ", newShippingAddress);

    // Find the customer by ID and update the shippingAddress field
    const result = await Customer.updateOne(
      { _id: ObjectId(customerId) },
      {
        $set: {
          shippingAddress: newShippingAddress,
        },
      },
      { upsert: true } // Create a new document if no document matches the filter
    );
    console.log("Added Shipping Address: ", result);

    if (result.nModified > 0 || result.upserted) {
      return res.send({
        message: "Shipping address added or updated successfully.",
      });
    } else {
      return res.status(404).send({ message: "Customer not found." });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;
    
    // Validate ObjectId format
    if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ message: "Invalid customer ID format" });
    }
    
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).send({ message: "Customer not found" });
    }
    res.send({ shippingAddress: customer?.shippingAddress });
  } catch (err) {
    // console.error("Error adding shipping address:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateShippingAddress = async (req, res) => {
  try {
    const activeDB = req.activeDB;

    const Customer = activeDB.model("Customer", CustomerModel);
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      customer.shippingAddress.push(req.body);

      await customer.save();
      res.send({ message: "Success" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteShippingAddress = async (req, res) => {
  try {
    const activeDB = req.activeDB;
    const { userId, shippingId } = req.params;

    const Customer = activeDB.model("Customer", CustomerModel);
    await Customer.updateOne(
      { _id: userId },
      {
        $pull: {
          shippingAddress: { _id: shippingId },
        },
      }
    );

    res.send({ message: "Shipping Address Deleted Successfully!" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ message: "Invalid customer ID format" });
    }
    
    // Validate the input
    const { name, email, address, mobile , image , country_id , state_id , city_id } = req.body;
    // Find the customer by ID
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).send({
        message: "Customer not found!",
      });
    }
    // Check if the email already exists and does not belong to the current customer
    const existingCustomer = await Customer.findOne({ email });
    if (
      existingCustomer &&
      existingCustomer._id.toString() !== customer._id.toString()
    ) {
      return res.status(400).send({
        message: "Email already exists.",
      });
    }

    // Update customer details
    customer.name = name;
    customer.email = email;
    customer.address = address;
    customer.mobile = mobile;
    customer.image = image;
    customer.city_id = city_id;
    customer.country_id = country_id;
    customer.state_id = state_id;

    const updatedUser = await customer.save();
    const token = signInToken(updatedUser);
    // Send the updated customer data with the new token
    res.send({
      token,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      mobile: updatedUser.mobile,
      image: updatedUser.image,
      message: "Customer updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ message: "Invalid customer ID format" });
    }
    
    const result = await Customer.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Customer not found" });
    }
    res.status(200).send({
      message: "User Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  loginCustomer,
  registerCustomer,
  addAllCustomers,
  signUpWithProvider,
  signUpWithOauthProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
