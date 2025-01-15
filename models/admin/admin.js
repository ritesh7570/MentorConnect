const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  permissions: { type: [String], required: false, default: [] }, // List of admin permissions
  department: { type: String, required: false, default: "" }, // Admin department
});

// Middleware to auto-populate the `user` field when querying
AdminSchema.pre("find", function () {
  this.populate("user");
});

AdminSchema.pre("findOne", function () {
  this.populate("user");
});

module.exports = mongoose.model("Admin", AdminSchema);
