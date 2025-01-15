const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../utils/logger")('routes'); // Specify label

const jobReviewController = require("../controllers/jobReviewController");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { isJobReviewAuthor, validateJobReview } = require("../middlewares/job");

// Route to create a new job review
router.post("/", isLoggedIn, (req, res, next) => {
    logger.info("======= [ROUTE: Create Job Review] =======");
    logger.info("[ACTION: Creating New Job Review]");
    logger.info(`User ID: ${req.user._id} is creating a new job review`);
    logger.debug(`Request body: ${JSON.stringify(req.body)}`);
    next();
}, validateJobReview, (req, res, next) => {
    logger.debug("Job review validation passed. Proceeding to create the review.");
    next();
}, jobReviewController.create, (req, res, next) => {
    logger.info("======= [END OF ACTION: Create Job Review] =======\n");
});

// Route to delete an existing job review
router.delete("/:reviewId", isLoggedIn, isJobReviewAuthor, (req, res, next) => {
    logger.info("======= [ROUTE: Delete Job Review] =======");
    logger.info("[ACTION: Deleting Job Review]");
    logger.info(`User ID: ${req.user._id} is deleting job review ID: ${req.params.reviewId}`);
    next();
}, jobReviewController.delete, (req, res, next) => {
    logger.info("======= [END OF ACTION: Delete Job Review] =======\n");
});

module.exports = router;
