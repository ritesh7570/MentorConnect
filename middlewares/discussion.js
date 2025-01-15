const Discussion = require("../models/discussion");
const { discussionSchema } = require("../schemas/discussionSchema");
const DiscussionReview = require("../models/discussionReview");
const { discussionReviewSchema } = require("../schemas/discussionReviewSchema");
const ExpressError = require("../utils/expressError");
const logger = require("../utils/logger")('middleware'); // Specify label

module.exports.isDiscussionOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const discussion = await Discussion.findById(id);
    if (!discussion.owner._id.equals(res.locals.currUser._id)) {
      logger.warn(`User ${res.locals.currUser._id} attempted to access discussion ${id} they do not own.`);
      req.flash("error", "You don't have permission");
      return res.redirect(`/discussions/${id}`);
    }
    logger.info(`User ${res.locals.currUser._id} successfully verified as owner of discussion ${id}.`);
    next();
  } catch (error) {
    logger.error(`Error verifying discussion ownership: ${error.message}`);
    next(error);
  }
};

module.exports.validateDiscussion = (req, res, next) => {
  console.log("validate discussion: req.body.discussion: ",req.body.discussion);
  
  const { error } = discussionSchema.validate(req.body.discussion);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    logger.error(`Discussion validation failed: ${errMsg}`);
    throw new ExpressError(400, errMsg);
  }
  logger.info("Discussion validation passed.");
  next();
};

module.exports.isDiscussionReviewAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const review = await DiscussionReview.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
      logger.warn(`User ${res.locals.currUser._id} attempted to access review ${reviewId} they did not author.`);
      req.flash("error", "You don't have permission");
      return res.redirect(`/discussions/${id}`);
    }
    logger.info(`User ${res.locals.currUser._id} successfully verified as author of review ${reviewId}.`);
    next();
  } catch (error) {
    logger.error(`Error verifying review author: ${error.message}`);
    next(error);
  }
};

module.exports.validateDiscussionReview = (req, res, next) => {
  const { error } = discussionReviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    logger.error(`Discussion review validation failed: ${errMsg}`);
    throw new ExpressError(400, errMsg);
  }
  logger.info("Discussion review validation passed.");
  next();
};
