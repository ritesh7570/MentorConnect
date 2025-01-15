const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobReviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
    trim: true, // Trim whitespace from the comment
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const JobReview = mongoose.model("JobReview", jobReviewSchema);
module.exports = JobReview;
