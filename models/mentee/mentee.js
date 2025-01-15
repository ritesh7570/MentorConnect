const mongoose = require("mongoose");
const { Schema } = mongoose;

// Updated Mentee Schema
const MenteeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goals: { type: [String], default: [] },
  educationLevel: { type: String, default: "" },
  bio: { type: String, default: "" },
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "ConnectionRequest" }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mentor" }],
  linkedIn: { type: String, default: "" },
  twitter: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  dob: { type: Date, default: null },
  city: { type: String, default: "" },
  country: { type: String, default: "" },
  projects: { type: [String], default: [] },
  achievements: { type: [String], default: [] },
  profilePicture: { type: String, default: "" },
  points: { type: Number, default: 0 },
  isStarMentee: { type: Boolean, default: false },
});

MenteeSchema.pre("find", function () {
  this.populate("user");
});

MenteeSchema.pre("findOne", function () {
  this.populate("user");
});

module.exports = mongoose.model("Mentee", MenteeSchema);
