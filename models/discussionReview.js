const mongoose = require("mongoose");
const { Schema } = mongoose;

const discussionReviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
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

const DiscussionReview = mongoose.model("DiscussionReview", discussionReviewSchema);
module.exports = DiscussionReview;
