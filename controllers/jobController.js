const Job = require("../models/job");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")('jobController'); // Specify label

module.exports.index = wrapAsync(async (req, res) => {
  console.log("controller index");
  
  logger.info("Fetching all jobs...");

  try {
    const jobs = await Job.find({}).populate("likes").populate("reports");
    // logger.info(`Found ${jobs.length} jobs.`);
    // Assuming `req.user` contains the logged-in user's data
    const userRole = req.user?.role || "mentee"; // Default to "mentee" if role isn't defined

    res.render("jobs/index", { jobs, userRole,cssFile: "job/jobIndex.css" });
  } catch (err) {
    logger.error(`Error fetching jobs: ${err}`);
    req.flash("error", "Unable to retrieve jobs at the moment.");
    res.redirect("/jobs");
  }
});

module.exports.renderNewForm = (req, res) => {
  logger.info("Rendering new job form.");
  const userRole = req.user?.role || "mentee"; // Default to "mentee" if role isn't defined

  res.render("jobs/new", { userRole,cssFile: "job/jobNew.css" });
};

module.exports.create = wrapAsync(async (req, res) => {
  logger.info("Creating new job...");
  try {
    const newJob = new Job(req.body.job);
    newJob.owner = req.user._id;
    
    // Save the new job
    await newJob.save();
    logger.info(`New job created with ID: ${newJob._id}`);
    
    // Update the user's jobPosts
    if (req.user) {
      if (!req.user.jobPosts.includes(newJob._id)) {
        req.user.jobPosts.push(newJob._id);
        await req.user.save();  // Save the updated user document
        logger.info(`User ${req.user.username} updated with new job ${newJob.title}`);
      } else {
        logger.info(`User ${req.user.username} already has job ${newJob.title} in jobPosts.`);
      }
    }
    
    req.flash("success", "New job created!");
    res.redirect("/jobs");
  } catch (err) {
    logger.error(`Error creating job: ${err}`);
    req.flash("error", "Failed to create job.");
    res.redirect("/jobs");
  }
});


module.exports.show = wrapAsync(async (req, res) => {
  const jobId = req.params.id;
  logger.info(`Fetching job with ID: ${jobId}`);
  try {
    const job = await Job.findById(jobId)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!job) {
      logger.info("Job not found.");
      req.flash("error", "Job does not exist!");
      return res.redirect("/jobs");
    }
    const userRole = req.user?.role || "mentee"; // Default to "mentee" if role isn't defined
    logger.info(`Job found: ${job._id}`);
    res.render("jobs/show", { job,userRole, cssFile: "job/jobShow.css" });
  } catch (err) {
    logger.error(`Error fetching job: ${err}`);
    req.flash("error", "Unable to retrieve job.");
    res.redirect("/jobs");
  }
});

module.exports.renderEditForm = wrapAsync(async (req, res) => {
  const jobId = req.params.id;
  logger.info(`Fetching job for editing with ID: ${jobId}`);
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      logger.info("Job not found.");
      req.flash("error", "Job does not exist!");
      return res.redirect("/jobs");
    }
    const userRole = req.user?.role || "mentee"; // Default to "mentee" if role isn't defined

    logger.info(`Job found for editing: ${job._id}`);
    res.render("jobs/edit", { job, userRole,cssFile: "job/jobEdit.css" });
  } catch (err) {
    logger.error(`Error fetching job for editing: ${err}`);
    req.flash("error", "Failed to load job for editing.");
    res.redirect("/jobs");
  }
});

module.exports.update = wrapAsync(async (req, res) => {
  const jobId = req.params.id;
  logger.info(`Updating job with ID: ${jobId}`);
  logger.info(`Request Body: ${JSON.stringify(req.body)}`);
  try {
    await Job.findByIdAndUpdate(jobId, { ...req.body.job });
    logger.info(`Job updated successfully: ${jobId}`);
    req.flash("success", "Job updated!");
    res.redirect(`/jobs/${jobId}`);
  } catch (err) {
    logger.error(`Error updating job: ${err}`);
    req.flash("error", "Failed to update job.");
    res.redirect(`/jobs/${jobId}`);
  }
});

module.exports.delete = wrapAsync(async (req, res) => {
  const jobId = req.params.id;
  logger.info(`Deleting job with ID: ${jobId}`);
  try {
    await Job.findByIdAndDelete(jobId);
    logger.info(`Job deleted successfully: ${jobId}`);
    req.flash("success", "Job deleted!");
    res.redirect("/jobs");
  } catch (err) {
    logger.error(`Error deleting job: ${err}`);
    req.flash("error", "Failed to delete job.");
    res.redirect("/jobs");
  }
});

module.exports.like = wrapAsync(async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user._id;
  logger.info(`User ${userId} attempting to like job with ID: ${jobId}`);
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      logger.info("Job not found.");
      req.flash("error", "Job does not exist!");
      return res.redirect("/jobs");
    }

    const hasLiked = job.likes.some((like) => like.equals(userId));

    if (hasLiked) {
      await Job.findByIdAndUpdate(jobId, { $pull: { likes: userId } });
      logger.info(`User unliked the job: ${jobId}`);
    } else {
      await Job.findByIdAndUpdate(jobId, { $push: { likes: userId } });
      logger.info(`User liked the job: ${jobId}`);
    }

    res.redirect("/jobs");
  } catch (err) {
    logger.error(`Error liking job: ${err}`);
    req.flash("error", "Failed to like job.");
    res.redirect("/jobs");
  }
});

module.exports.comment = wrapAsync(async (req, res) => {
  const jobId = req.params.id;
  logger.info(`User ${req.user._id} commenting on job with ID: ${jobId}`);
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      logger.info("Job not found.");
      req.flash("error", "Job not found");
      return res.redirect("/jobs");
    }

    res.redirect(`/jobs/${jobId}#comment-section`);
  } catch (err) {
    logger.error(`Error commenting on job: ${err}`);
    req.flash("error", "Failed to comment on job.");
    res.redirect(`/jobs/${jobId}`);
  }
});

module.exports.report = wrapAsync(async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user._id;
  logger.info(`User ${userId} attempting to report job with ID: ${jobId}`);
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      logger.info("Job not found.");
      req.flash("error", "Job does not exist!");
      return res.redirect("/jobs");
    }

    const hasReported = job.reports.some((report) => report.equals(userId));

    if (hasReported) {
      await Job.findByIdAndUpdate(jobId, { $pull: { reports: userId } });
      logger.info(`User removed report from job: ${jobId}`);
    } else {
      await Job.findByIdAndUpdate(jobId, { $push: { reports: userId } });
      logger.info(`User reported the job: ${jobId}`);
    }

    req.flash("success", "Job reported!");
    res.redirect("/jobs");
  } catch (err) {
    logger.error(`Error reporting job: ${err}`);
    req.flash("error", "Failed to report job.");
    res.redirect("/jobs");
  }
});
