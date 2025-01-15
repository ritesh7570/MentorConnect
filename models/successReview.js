const mongoose = require("mongoose");
const { Schema } = mongoose;

const successReviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Ensure Date.now is a function reference
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const SuccessReview = mongoose.model("SuccessReview", successReviewSchema);
module.exports = SuccessReview;
