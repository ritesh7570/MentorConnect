const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../utils/logger")('eventReviewRoutes');


const eventReviewController = require("../controllers/eventReviewController");

// Route to create a new event review
router.post("/", (req, res, next) => {
    logger.info("======= [ROUTE: Create Event Review] =======");
    logger.info("[ACTION: Creating New Event Review]");
    logger.info("User ID: %s is creating a new event review", req.user ? req.user._id : 'Not logged in');
    logger.debug("Request body: %s", JSON.stringify(req.body));
    next();
}, eventReviewController.create);

// Route to delete an existing event review
router.delete("/:reviewId", (req, res, next) => {
    logger.info("======= [ROUTE: Delete Event Review] =======");
    logger.info("[ACTION: Deleting Event Review]");
    logger.info("User ID: %s is deleting event review ID: %s", req.user ? req.user._id : 'Not logged in', req.params.reviewId);
    next();
}, eventReviewController.deleteReview);

module.exports = router;
