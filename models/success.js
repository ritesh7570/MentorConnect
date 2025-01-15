const mongoose = require("mongoose");
const { Schema } = mongoose;
const SuccessReview = require("./successReview");

const successSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    publicId: String, // Public ID for managing Cloudinary assets
  },
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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "SuccessReview",
    },
  ],
});

// Middleware to delete related reviews when a success story is deleted
successSchema.post("findOneAndDelete", async function (successStory) {
  if (successStory) {
    await SuccessReview.deleteMany({ _id: { $in: successStory.reviews } });
  }
});

module.exports = mongoose.model("Success", successSchema);
