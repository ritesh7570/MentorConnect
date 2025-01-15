const Success = require("../models/success");
const SuccessReview = require("../models/successReview");
const { successReviewSchema } = require("../schemas/successReviewSchema");
const { successSchema } = require("../schemas/successSchema");
const ExpressError = require("../utils/expressError");
const logger = require("../utils/logger")('successMiddleware'); // Specify label

// Middleware to check if the logged-in user is the owner of the success story
module.exports.isStoryOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Checking ownership for success story ID: ${id}`);

    const successStory = await Success.findById(id);

    if (!successStory) {
      logger.warn(`Success story with ID: ${id} not found`);
      req.flash("error", "Success story not found");
      return res.redirect("/successes");
    }

    logger.info(`Success story owner ID: ${successStory.owner}, Logged-in user ID: ${res.locals.currUser._id}`);

    if (!successStory.owner.equals(res.locals.currUser._id)) {
      logger.warn("Ownership mismatch. User is not authorized.");
      req.flash("error", "You don't have permission");
      return res.redirect(`/successes`);
    }

    logger.info("Ownership confirmed. Proceeding to the next middleware.");
    next();
  } catch (err) {
    logger.error(`Error in isStoryOwner middleware: ${err.message}`);
    next(err);
  }
};

// Middleware to validate success schema
module.exports.validateSuccess = (req, res, next) => {
  try {
    logger.info("Validating success schema...");
    logger.debug(`Request body: ${JSON.stringify(req.body)}`);

    const { error } = successSchema.validate(req.body);

    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      logger.error(`Validation error: ${errMsg}`);
      throw new ExpressError(400, errMsg);
    }

    logger.info("Success schema validation passed. Proceeding to the next middleware.");
    next();
  } catch (err) {
    logger.error(`Error in validateSuccess middleware: ${err.message}`);
    next(err);
  }
};

// Middleware to check if the logged-in user is the author of the success review
module.exports.isSuccessReviewAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    logger.info(`Checking if user is author of success review ID: ${reviewId}`);

    const review = await SuccessReview.findById(reviewId);

    if (!review) {
      logger.warn(`Success review with ID: ${reviewId} not found`);
      req.flash("error", "Review not found");
      return res.redirect(`/successes`);
    }

    logger.info(`Review author ID: ${review.author}, Logged-in user ID: ${res.locals.currUser._id}`);

    if (!review.author.equals(res.locals.currUser._id)) {
      logger.warn("User is not authorized to edit this review");
      req.flash("error", "You don't have permission");
      return res.redirect(`/successes`);
    }

    logger.info("User is authorized to edit this review.");
    next();
  } catch (err) {
    logger.error(`Error in isSuccessReviewAuthor middleware: ${err.message}`);
    next(err);
  }
};

// Middleware to validate success review schema
module.exports.validateSuccessReview = (req, res, next) => {
  try {
    logger.info("Validating success review schema...");
    logger.debug(`Request body: ${JSON.stringify(req.body)}`);

    const { error } = successReviewSchema.validate(req.body);

    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      logger.error(`Validation error: ${errMsg}`);
      throw new ExpressError(400, errMsg);
    }

    logger.info("Success review schema validation passed. Proceeding to the next middleware.");
    next();
  } catch (err) {
    logger.error(`Error in validateSuccessReview middleware: ${err.message}`);
    next(err);
  }
};
