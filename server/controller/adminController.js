const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const { signInToken, tokenForVerify } = require("../config/auth");
// here change is required
const Admin = require("../models/Admin");
const Otp = require("../models/Otp.model");
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum")
const fileUploadHelper = require('../fileUploader/fileUploadHelper');
const { sendEmail } = require("../lib/email-sender/sender");

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const registerAdmin = async (req, res) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        image: req.body.image,
        password: bcrypt.hashSync(req.body.password),
      });
      const staff = await newStaff.save();

      // Generate and send OTP
      const otp = generateOTP();
      const otpDoc = new Otp({
        email: req.body.email,
        otp: otp,
        type: 'signup'
      });
      await otpDoc.save();

      // Send OTP email
      const body = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Email Verification OTP - Kachabazar Admin",
        html: `<h2>Hello ${req.body.name}</h2>
        <p>Welcome to Kachabazar Admin Panel!</p>
        <p>Your verification code is: <strong style="font-size: 24px; color: #22c55e;">${otp}</strong></p>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p style="margin-top: 35px;">Thank you</p>
        <strong>Kachabazar Admin Team</strong>`,
      };
      const message = "OTP sent to your email!";
      sendEmail(body, res, message);

      // Return success without token (will be set after OTP verification)
      res.send({
        message: "Registration successful! Please check your email for OTP verification.",
        email: req.body.email,
        requiresOtp: true
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
      });
    }

    console.log('🔐 Admin login attempt for email:', email);

    const [admin] = await Admin.aggregate([
      { $match: { email: email } },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleData"
        }
      },
      { $unwind: { path: "$roleData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          phone: 1,
          email: 1,
          image: 1,
          password: 1,
          salesman_id: 1,
          permission: { $ifNull: ["$roleData.permission", "$permission"] } // Extract permission from role
        }
      }
    ]);

    console.log('🔐 Admin found:', admin ? 'Yes' : 'No');

    if (!admin) {
      console.log('🔐 Admin not found for email:', email);
      return res.status(401).send({
        message: "Invalid Email or password!",
      });
    }

    if (!bcrypt.compareSync(password, admin.password)) {
      console.log('🔐 Invalid password for admin:', email);
      return res.status(401).send({
        message: "Invalid Email or password!",
      });
    }

    // Generate token
    const token = signInToken(admin);
    const response = {
      token,
      _id: admin._id,
      name: admin.name,
      phone: admin.phone,
      email: admin.email,
      image: admin.image,
      salesman_id: admin.salesman_id || null,
      permission: admin.permission || [] // Final permission comes from Role
    };

    console.log('🔐 Admin login successful for:', email);
    res.send(response);

  } catch (err) {
    console.error('🔐 Admin login error:', err);
    res.status(500).send({
      message: "Internal server error during login",
    });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Admin.findOne({ email: req.body.verifyEmail });
  if (!isAdded) {
    return res.status(404).send({
      message: "Admin/Staff Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: `<h2>Hello ${req.body.verifyEmail}</h2>
      <p>A request has been received to change the password for your <strong>Kachabazar</strong> account </p>
        <p>This link will expire in <strong> 15 minute</strong>.</p>
        <p style="margin-bottom:20px;">Click this link for reset your password</p>
        <a href=${process.env.ADMIN_URL}/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>
        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@VTC shoe.com</p>
        <p style="margin-bottom:0px;">Thank you</p>
        <strong>VTC shoe Team</strong>
             `,
    };
    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const staff = await Admin.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        staff.password = bcrypt.hashSync(req.body.newPassword);
        staff.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const addStaff = async (req, res) => {
  // console.log(req.body)

  try {

    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(500).send({ message: "This Email already Added!" });
    } else {
      const { base64File, fileName } = req.body.image ?? {};
      let uploadPath = ""
      if (base64File) {
        const cleanedBase64File = base64File.split(';base64,').pop();
        uploadPath = await fileUploadHelper.uploadSingleFile(`document`, fileName, cleanedBase64File);
      }
      const newStaff = new Admin({
        name: { en: req.body.name },
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        passwordView: req.body.password,
        phone: req.body.phone,
        joiningDate: req.body.joiningDate,
        role: Object(req.body.role),
        image: uploadPath,
        permission: req.body.permission,
        ...(req.body.salesman_id && { salesman_id: req.body.salesman_id })
      });
      await newStaff.save();

      // Send email notification if salesman_id is tagged
      if (req.body.salesman_id) {
        const body = {
          from: process.env.EMAIL_USER,
          to: req.body.email,
          subject: "Salesman Assignment Notification",
          html: `<h2>Hello ${req.body.name}</h2>
          <p>Your account has been tagged as a Salesman in the system.</p>
          <p>You can now login and manage your assigned customers and vendors.</p>
          <p>Email: ${req.body.email}</p>
          ${req.body.password ? `<p>Password: ${req.body.password}</p>` : ''}
          <p style="margin-top: 35px;">Thank you</p>
          <strong>Selection Footwear Team</strong>`,
        };
        sendEmail(body, null, "Salesman assignment email sent");
      }

      res.status(200).send({
        message: `Staff ${CREATE_MESSAGE}`,
      });
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message });
  }
};

const getAllStaff = async (req, res) => {
  // console.log('allamdin')
  try {
    // const admins = await Admin.find({}).sort({ _id: -1 });
    // console.log(admins)

    //   const admins1 = await Admin.find({ status:"Active" })
    //   .select('status name email phone image joiningData')
    //   .populate({
    //     path: 'role', // Field in Admin to populate
    //     model: 'Role', // Model to use for population
    //     match: { is_active: true }, // Only include Roles where is_active is true
    //     select: 'name permission description', // Only include specific fields from Role
    //   });

    // console.log(admins1);


    const admins2 = await Admin.find({})
      .select("status name email phone image joiningDate passwordView")
      .populate({
        path: "role",
        model: "Role",
        match: { is_active: true },
        select: "name permission description -_id",
      })
      .lean(); // Convert to plain JavaScript objects

    // Transform the data
    const transformedAdmins = admins2.map(admin => {
      // Format joiningData as DD/MM/YYYY
      if (admin.joiningDate) {
        admin.joiningData = new Date(admin.joiningDate).toLocaleDateString("en-GB"); // Format to DD/MM/YYYY
      }
      // Merge role fields into the admin document
      if (admin.role) {
        admin.role_name = admin.role.name;
        admin.permission = admin.role.permission;
        admin.description = admin.role.description;
      }
      // Remove the nested role object
      admin.passwordView = admin.passwordView;
      delete admin.role;
      return admin;
    });

    console.log(transformedAdmins)

    res.send(transformedAdmins);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const getAllStaff = async (req, res) => {
//   try {
//     const admins = await Admin.find({}).sort({ _id: -1 });
//     res.send(admins);
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getStaffById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStaff = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).send({ message: "This staff not found!" });
    }
    console.log(req.body, 'bodyasdfasdfad')
    let uploadPath;
    // Handle image upload if a base64 file is provided
    if (req.body.image && req.body.image?.fileName) {
      const { base64File, fileName } = req.body.image;
      const cleanedBase64File = base64File.split(';base64,').pop();
      uploadPath = await fileUploadHelper.uploadSingleFile(
        "document",
        fileName,
        cleanedBase64File
      );
    } else {
      uploadPath = req.body?.image;
    }

    // Update staff fields
    admin.name = { en: req.body.name };
    admin.email = req.body.email;
    admin.phone = req.body.phone;
    admin.role = req.body.role;
    admin.joiningDate = req.body.joiningDate; // ✅ fixed typo (was joiningData)
    admin.salesman_id = req.body.salesman_id || null;

    // Update password only if provided
    if (req.body.password) {
      admin.password = bcrypt.hashSync(req.body.password, 8); // ✅ added salt rounds and fixed comma bug
      admin.passwordView = req.body.password;
    }
    admin.image = uploadPath ?? "";
    const updatedAdmin = await admin.save();

    // Send email notification if salesman_id is newly tagged or changed
    if (req.body.salesman_id && req.body.salesman_id !== String(admin.salesman_id)) {
      const body = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: "Salesman Profile Updated",
        html: `<h2>Hello ${admin.name.en || admin.name}</h2>
        <p>Your account salesperson assignment has been updated.</p>
        <p>You can now manage your assigned customers and vendors under this profile.</p>
        <p style="margin-top: 35px;">Thank you</p>
        <strong>Selection Footwear Team</strong>`,
      };
      sendEmail(body, null, "Salesman update email sent");
    }

    // Generate token for updated user
    const token = signInToken(updatedAdmin);
    res.status(200).send({
      token,
      message: `Staff ${UPDATE_MESSAGE}`,
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      image: updatedAdmin.image,
    });
  } catch (err) {
    console.error("Error updating staff:", err);
    res.status(500).send({ message: err.message });
  }
};


const deleteStaff = (req, res) => {
  Admin.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: `Staff ${DELETE_MESSAGE}`,
      });
    }
  });
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Admin.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Staff ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Send OTP for verification (can be used for resend)
const sendOtp = async (req, res) => {
  try {
    const { email, type = 'signup' } = req.body;

    if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    }

    // Check if user exists (for signup type)
    if (type === 'signup') {
      const userExists = await Admin.findOne({ email });
      if (!userExists) {
        return res.status(404).send({
          message: "User not found. Please register first.",
        });
      }
    }

    // Check rate limiting - max 3 OTP requests per hour per email
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await Otp.countDocuments({
      email,
      type,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentOtps >= 3) {
      return res.status(429).send({
        message: "Too many OTP requests. Please try again after 1 hour.",
      });
    }

    // Delete any existing unverified OTPs for this email and type
    await Otp.deleteMany({ email, type, isVerified: false });

    // Generate and save new OTP
    const otp = generateOTP();
    const otpDoc = new Otp({
      email,
      otp,
      type
    });
    await otpDoc.save();

    // Send OTP email
    const subject = type === 'signup' ? "Email Verification OTP" : "Login OTP";
    const body = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${subject} - Kachabazar Admin`,
      html: `<h2>Hello</h2>
      <p>Your ${type} verification code is: <strong style="font-size: 24px; color: #22c55e;">${otp}</strong></p>
      <p>This code will expire in <strong>5 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p style="margin-top: 35px;">Thank you</p>
      <strong>Kachabazar Admin Team</strong>`,
    };
    const message = "OTP sent to your email!";
    sendEmail(body, res, message);

  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp, type = 'signup' } = req.body;

    if (!email || !otp) {
      return res.status(400).send({
        message: "Email and OTP are required",
      });
    }

    // Find the OTP document
    const otpDoc = await Otp.findOne({
      email,
      type,
      isVerified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      return res.status(400).send({
        message: "OTP expired or invalid",
      });
    }

    // Check attempts
    if (otpDoc.attempts >= 3) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).send({
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).send({
        message: `Invalid OTP. ${3 - otpDoc.attempts} attempts remaining.`,
      });
    }

    // Mark OTP as verified
    otpDoc.isVerified = true;
    await otpDoc.save();

    // For signup, get user data and generate token
    if (type === 'signup') {
      const [admin] = await Admin.aggregate([
        { $match: { email: email } },
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "roleData"
          }
        },
        { $unwind: { path: "$roleData", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            name: 1,
            phone: 1,
            email: 1,
            image: 1,
            password: 1,
            salesman_id: 1,
            permission: { $ifNull: ["$roleData.permission", "$permission"] }
          }
        }
      ]);

      if (!admin) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      const token = signInToken(admin);
      const response = {
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
        salesman_id: admin.salesman_id || null,
        permission: admin.permission || []
      };

      res.send({
        message: "Email verified successfully!",
        ...response
      });
    } else {
      res.send({
        message: "OTP verified successfully!"
      });
    }

  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const { getDashboardData } = require('./saleorder.controller');

module.exports = {
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
  getDashboardData,
};
