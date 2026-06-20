require("dotenv").config();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const signInToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
      salesman_id: user.salesman_id || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    }
  );
};

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

const isAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send({
        message: "Authorization header is required",
      });
    }

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "Authorization header must start with Bearer",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        message: "Token is required",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).send({
        message: "Server configuration error",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("🔐 Auth middleware error:", err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({
        message: "Token has expired",
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).send({
        message: "Invalid token",
      });
    } else {
      return res.status(401).send({
        message: "Authentication failed",
      });
    }
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next();
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return next();
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("🔐 Optional auth middleware error:", err.message);
    next();
  }
};

const isAdmin = async (req, res, next) => {
  const admin = await Admin.findOne({ role: "Admin" });
  if (admin) {
    next();
  } else {
    res.status(401).send({
      message: "User is not Admin",
    });
  }
};

module.exports = {
  signInToken,
  tokenForVerify,
  isAuth,
  optionalAuth,
  isAdmin,
};
