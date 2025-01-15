const mongoose = require("mongoose");
const { Schema } = mongoose;
const DiscussionReview = require("./discussionReview"); // Import the DiscussionReview model

const discussionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  queryType: {
    type: String,
    required: true,
    enum: [
      "Job",
      "Internship",
      "General Query",
      "Life Update",
      "Achievement",
      "Pledge",
      "Technical Query",
      "Notes",
      "Help",
      "Other",
    ],
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "DiscussionReview",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reports: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

discussionSchema.post("findOneAndDelete", async (discussion) => {
  if (discussion) {
    await DiscussionReview.deleteMany({ _id: { $in: discussion.reviews } });
  }
});

const Discussion = mongoose.model("Discussion", discussionSchema);
module.exports = Discussion;
