const mongoose = require("mongoose");
const { Schema } = mongoose;

// Mentor Schema
const MentorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pricePerSession: { type: Number, default: 50 },
  expertise: { type: [String], default: [] }, // Industry expertise (e.g., MERN stack)
  yearsOfExperience: { type: Number, default: 0 },
  bio: { type: String, default: "" },
  linkedIn: { type: String, default: "" },
  twitter: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "ConnectionRequest" }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mentee" }],
  dob: { type: Date, default: null },
  city: { type: String, default: "" },
  country: { type: String, default: "" },
  graduationYear: { type: Number, default: null },
  degree: { type: String, default: "" },
  department: { type: String, default: "" },
  employer: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  industry: { type: String, default: "" },  // Industry expertise (e.g., software development, MERN)
  experience: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  projects: { type: [String], default: [] },
  achievements: { type: [String], default: [] },
  profilePicture: { type: String, default: "" },
  points: { type: Number, default: 0 },
  isStarMentor: { type: Boolean, default: false },
  experienceCertificate: { 
    type: String,  // A URL or path to the certificate uploaded by the mentor
    default: "", 
  },
  calendlyLink: { 
    type: String,  // URL to the mentor's Calendly account
    required: false 
  },
  registrationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // Mentor is initially pending approval
  },
  isOnboardingFormSubmited: {
    type: Boolean,
    default: false,
  },
  fallbackRoutes: {
    type: String,
    default: "",
  }
});

// Middleware to auto-populate the `user` field when querying
MentorSchema.pre("find", function () {
  this.populate("user");
});

MentorSchema.pre("findOne", function () {
  this.populate("user");
});

// Export the Mentor model
module.exports = mongoose.model("Mentor", MentorSchema);
