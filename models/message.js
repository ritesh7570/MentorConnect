const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: false, default: "" }, // Message content
   // fileUrl: { type: String, required: false }, // File link if applicable
    //fileType: { type: String, required: false }, // Type of file (image, document, etc.)
    seen: { type: Boolean, default: false }, // Mark if the message is seen
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
