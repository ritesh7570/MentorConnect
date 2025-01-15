const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee", required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  reason: { type: String, default: "" }, // Reason for rejection or acceptance
  message: { type: String, default: "" }, // Optional message with the request
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);  // Ensure you're exporting the model like this
