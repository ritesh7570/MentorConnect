const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "mentor", "mentee"] },
  email: { type: String },
  blockedUsers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [], // Default to an empty array
  },
  reportedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  }, // List of users who reported this mentor
  isBlacklisted: { type: Boolean, default: false }, // Blacklist status
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
