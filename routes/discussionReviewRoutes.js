const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../utils/logger")('route'); // Import the logger with 'route' label
const discussionReviewController = require("../controllers/discussionReviewController");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { isDiscussionReviewAuthor, validateDiscussionReview } = require("../middlewares/discussion");

// Route to create a discussion review
router
  .route("/")
  .post(
    isLoggedIn,
    (req, res, next) => {
      logger.info("======= [ROUTE: Create Discussion Review] =======");
      logger.info(`[ACTION: Creating Discussion Review] User ID: ${req.user._id} is attempting to create a discussion review for discussion ID: ${req.params.id}`);
      next();
    },
    validateDiscussionReview,
    (req, res, next) => {
      logger.debug("Discussion review validation completed. Proceeding to controller.");
      next();
    },
    discussionReviewController.create
  );

// Route to delete a discussion review
router
  .route("/:reviewId")
  .delete(
    isLoggedIn,
    (req, res, next) => {
      logger.info("======= [ROUTE: Delete Discussion Review] =======");
      logger.info(`[ACTION: Deleting Discussion Review] User ID: ${req.user._id} is attempting to delete discussion review ID: ${req.params.reviewId}`);
      next();
    },
    isDiscussionReviewAuthor,
    (req, res, next) => {
      logger.debug("Discussion review author validation completed. Proceeding to controller.");
      next();
    },
    discussionReviewController.delete
  );

module.exports = router;
