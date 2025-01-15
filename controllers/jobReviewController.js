const Job = require("../models/job");
const JobReview = require("../models/jobReview");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")('jobReviewController'); // Specify label

// Create a new job review
module.exports.create = wrapAsync(async (req, res) => {
  const jobId = req.params.id;
  logger.info(`Creating a new job review for job ID: ${jobId}`);

  try {
    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      logger.error(`Job with ID: ${jobId} not found.`);
      req.flash("error", "Job not found.");
      return res.redirect("/jobs");
    }

    // Create and save the new review
    const newJobReview = new JobReview(req.body.jobReview);
    newJobReview.author = req.user._id;
    
    job.reviews.push(newJobReview);
    await newJobReview.save();
    await job.save();

    logger.info(`New job review created with ID: ${newJobReview._id} for job ID: ${jobId}`);
    req.flash("success", "New job review created!");
    res.redirect(`/jobs/${jobId}`);
  } catch (err) {
    logger.error(`Error creating job review for job ID: ${jobId}. Error: ${err.message}`);
    req.flash("error", "Failed to create job review.");
    res.redirect(`/jobs/${jobId}`);
  }
});

// Delete a job review
module.exports.delete = wrapAsync(async (req, res) => {
  const { id: jobId, reviewId } = req.params;
  logger.info(`Deleting job review with ID: ${reviewId} from job ID: ${jobId}`);

  try {
    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      logger.error(`Job with ID: ${jobId} not found.`);
      req.flash("error", "Job not found.");
      return res.redirect("/jobs");
    }

    // Remove the review from the job and delete the review
    await Job.findByIdAndUpdate(jobId, { $pull: { reviews: reviewId } });
    await JobReview.findByIdAndDelete(reviewId);

    logger.info(`Job review with ID: ${reviewId} deleted from job ID: ${jobId}`);
    req.flash("success", "Job review deleted!");
    res.redirect(`/jobs/${jobId}`);
  } catch (err) {
    logger.error(`Error deleting job review with ID: ${reviewId} from job ID: ${jobId}. Error: ${err.message}`);
    req.flash("error", "Failed to delete job review.");
    res.redirect(`/jobs/${jobId}`);
  }
});
