const mongoose = require("mongoose");
const { Schema } = mongoose;
const JobReview = require("./jobReview"); // Import the JobReview model

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["Full-time", "Part-time", "Internship"],
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  applyLink: {
    type: String,
    required: true,
    trim: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "JobReview",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reports: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

jobSchema.pre("save", function (next) {
  if (!this.likes) {
    this.likes = [];
  }
  if (!this.reports) {
    this.reports = [];
  }
  next();
});

// Middleware to handle the deletion of reviews when a job is deleted
jobSchema.post("findOneAndDelete", async (job) => {
  if (job) {
    await JobReview.deleteMany({ _id: { $in: job.reviews } });
  }
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
