const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    name: {
      type: Object,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    password: {
      type: String,
      required: false,
      default: bcrypt.hashSync("12345678"),
    },
    passwordView: {
      type: String,
      required: false,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    joiningDate: {
      type: Date,
      required: false,
    },    
    transcationsId: {
      type: String,
      required: false,
    },
    createby: {
      type: String,
      required: false,
    },
    companyCode: {
      type: String,
      required: false,
    },
    permission: [
      {
        type: Map,  // Using `Map` to represent a flexible JSON-like object
        of: String, // Specifies that the keys of the map are strings
      }
    ],
    salesman_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', default: null }
    // role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;


// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const Schema = mongoose.Schema;

// const adminSchema = new Schema(
//   {
//     name: {
//       type: Object,
//       required: true,
//     },
//     image: {
//       type: String,
//       required: false,const mongoose = require("mongoose");


//     },
//     address: {
//       type: String,
//       required: false,
//     },
//     country: {
//       type: String,
//       required: false,
//     },
//     state: {
//       type: String,
//       required: false,
//     },
//     city: {
//       type: String,
//       required: false,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     phone: {
//       type: String,
//       required: false,
//     },
//     status: {
//       type: String,
//       required: false,
//       default: "Active",
//       enum: ["Active", "Inactive"],
//     },
//     password: {
//       type: String,
//       required: false,
//       default: bcrypt.hashSync("12345678"),
//     },
//     role: {
//       type: Schema.Types.ObjectId,
//       ref: "Role",
//       required: true,
//     },
//     joiningData: {
//       type: Date,
//       required: false,
//     },
//     transcationsId: {
//       type: String,
//       required: false,
//     },
//     createby: {
//       type: String,
//       required: false,
//     },
//     companyCode: {
//       type: String,
//       required: false,
//     },
//     permission: [
//       {
//         type: Map,  // Using `Map` to represent a flexible JSON-like object
//         of: String, // Specifies that the keys of the map are strings
//       }
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// const Admin = mongoose.model("Admin", adminSchema);
// module.exports = Admin;
