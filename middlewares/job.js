const Job = require("../models/job");
const { jobSchema } = require("../schemas/jobSchema");
const JobReview = require("../models/jobReview");
const { jobReviewSchema } = require("../schemas/jobReviewSchema");
const ExpressError = require("../utils/expressError");
const logger = require("../utils/logger")('jobMiddleware'); // Specify label

// Middleware to check if the logged-in user is the owner of the job
module.exports.isJobOwner = async (req, res, next) => {
  const { id } = req.params;
  try {
    logger.info(`Checking ownership for job ID: ${id}`);

    const job = await Job.findById(id).populate("owner");

    if (!job) {
      logger.warn(`Job with ID: ${id} not found`);
      req.flash("error", "Job not found!");
      return res.redirect("/jobs");
    }

    logger.info(`Job owner ID: ${job.owner._id}, Logged-in user ID: ${res.locals.currUser._id}`);

    if (!job.owner._id.equals(res.locals.currUser._id)) {
      logger.warn("Ownership mismatch. User is not authorized.");
      req.flash("error", "You don't have permission");
      return res.redirect(`/jobs/${id}`);
    }

    logger.info("Ownership confirmed. Proceeding to the next middleware.");
    next();
  } catch (e) {
    logger.error(`Error in isJobOwner middleware: ${e.message}`);
    next(e);
  }
};

// Middleware to validate job schema
module.exports.validateJob = (req, res, next) => {
  try {
    logger.info("Validating job schema...");
    logger.debug(`Request body: ${JSON.stringify(req.body.job)}`);

    const { error } = jobSchema.validate(req.body.job);

    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      logger.error(`Validation error: ${errMsg}`);
      throw new ExpressError(400, errMsg);
    }

    logger.info("Job schema validation passed. Proceeding to the next middleware.");
    next();
  } catch (e) {
    logger.error(`Error in validateJob middleware: ${e.message}`);
    next(e);
  }
};

// Middleware to validate job review schema
module.exports.validateJobReview = (req, res, next) => {
  try {
    logger.info("Validating job review schema...");
    logger.debug(`Request body: ${JSON.stringify(req.body)}`);

    const { error } = jobReviewSchema.validate(req.body);

    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      logger.error(`Validation error: ${errMsg}`);
      throw new ExpressError(400, errMsg);
    }

    logger.info("Job review schema validation passed. Proceeding to the next middleware.");
    next();
  } catch (e) {
    logger.error(`Error in validateJobReview middleware: ${e.message}`);
    next(e);
  }
};

// Middleware to check if the logged-in user is the author of the job review
module.exports.isJobReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  try {
    logger.info(`Checking review author for review ID: ${reviewId} in job ID: ${id}`);

    const jobReview = await JobReview.findById(reviewId);

    if (!jobReview) {
      logger.warn(`Job review with ID: ${reviewId} not found`);
      req.flash("error", "Review not found");
      return res.redirect(`/jobs/${id}`);
    }

    logger.info(`Review author ID: ${jobReview.author}, Logged-in user ID: ${res.locals.currUser._id}`);

    if (!jobReview.author.equals(res.locals.currUser._id)) {
      logger.warn("Review author mismatch. User is not authorized.");
      req.flash("error", "You don't have permission");
      return res.redirect(`/jobs/${id}`);
    }

    logger.info("Review author confirmed. Proceeding to the next middleware.");
    next();
  } catch (e) {
    logger.error(`Error in isJobReviewAuthor middleware: ${e.message}`);
    next(e);
  }
};
