const mongoose = require("mongoose");
 
const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    transactions_id: {
      type: Number,
      required: false,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
    created_by: {
      type: String,
      required: false,
    },
    modified_by: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    permission: [
      {
        type: Map,
        of: String,
      },
    ],
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);
 
const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;
 
 