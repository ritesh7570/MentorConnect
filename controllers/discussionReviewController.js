const Discussion = require("../models/discussion");
const DiscussionReview = require("../models/discussionReview");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")('discussionReviewController'); // Specify label
module.exports.create = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: DiscussionReview] =======");
  logger.info("[ACTION: Create Review]");
  logger.info(`Discussion ID: ${req.params.id}`);
  logger.info(`Request Body: ${JSON.stringify(req.body)}`);

  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      logger.error("Discussion not found!");
      req.flash("error", "Discussion not found");
      return res.redirect(`/discussions`);
    }

    const newDiscussionReview = new DiscussionReview(req.body.discussionReview);
    newDiscussionReview.author = req.user._id;
    discussion.reviews.push(newDiscussionReview);

    await newDiscussionReview.save();
    await discussion.save();

    logger.info(`New review created with ID: ${newDiscussionReview._id}`);

    req.flash("success", "New review created!");
    res.redirect(`/discussions/${req.params.id}`);

  } catch (err) {
    logger.error(`Error creating review: ${err}`);
    req.flash("error", "Failed to create review.");
    res.redirect(`/discussions/${req.params.id}`);
  }

  logger.info("======= [END OF ACTION: Create Review] =======\n");
});

module.exports.delete = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: DiscussionReview] =======");
  logger.info("[ACTION: Delete Review]");
  logger.info(`Discussion ID: ${req.params.id}, Review ID: ${req.params.reviewId}`);

  try {
    await Discussion.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
    await DiscussionReview.findByIdAndDelete(req.params.reviewId);

    logger.info(`Review deleted: ${req.params.reviewId}`);

    req.flash("success", "Review deleted!");
    res.redirect(`/discussions/${req.params.id}`);

  } catch (err) {
    logger.error(`Error deleting review: ${err}`);
    req.flash("error", "Failed to delete review.");
    res.redirect(`/discussions/${req.params.id}`);
  }

  logger.info("======= [END OF ACTION: Delete Review] =======\n");
});
