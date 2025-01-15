const EventReview = require("../models/eventReview");
const Event = require("../models/event");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger");

// Add a Review to an Event
module.exports.addReview = wrapAsync(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;
  logger.info(`User ${userId} adding a review for event with ID: ${eventId}`);

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      logger.info("Event not found.");
      req.flash("error", "Event does not exist!");
      return res.redirect("/events");
    }

    const review = new EventReview({
      comment: req.body.review.comment,
      reviewer: userId,
      event: eventId,
    });

    await review.save();
    logger.info(`Review added for event: ${eventId} by user: ${userId}`);

    req.flash("success", "Your review has been posted.");
    res.redirect(`/events/${eventId}`);
  } catch (err) {
    logger.error("Error adding review:", err);
    req.flash("error", "Failed to add review.");
    res.redirect(`/events/${eventId}`);
  }
});

// Delete a Review
module.exports.deleteReview = wrapAsync(async (req, res) => {
  const { reviewId, eventId } = req.params;
  logger.info(`Deleting review with ID: ${reviewId} for event ID: ${eventId}`);

  try {
    const review = await EventReview.findById(reviewId);

    if (!review) {
      logger.info("Review not found.");
      req.flash("error", "Review not found!");
      return res.redirect(`/events/${eventId}`);
    }

    // Make sure only the review's author or an admin can delete the review
    if (!review.reviewer.equals(req.user._id) && !req.user.isAdmin) {
      req.flash("error", "You don't have permission to delete this review.");
      return res.redirect(`/events/${eventId}`);
    }

    await EventReview.findByIdAndDelete(reviewId);
    logger.info(`Review deleted with ID: ${reviewId}`);

    req.flash("success", "Review deleted successfully.");
    res.redirect(`/events/${eventId}`);
  } catch (err) {
    logger.error("Error deleting review:", err);
    req.flash("error", "Failed to delete review.");
    res.redirect(`/events/${eventId}`);
  }
});

// Edit a Review
module.exports.editReview = wrapAsync(async (req, res) => {
  const { reviewId, eventId } = req.params;
  logger.info(`Editing review with ID: ${reviewId} for event ID: ${eventId}`);

  try {
    const review = await EventReview.findById(reviewId);

    if (!review) {
      logger.info("Review not found.");
      req.flash("error", "Review not found!");
      return res.redirect(`/events/${eventId}`);
    }

    // Make sure only the review's author can edit the review
    if (!review.reviewer.equals(req.user._id)) {
      req.flash("error", "You don't have permission to edit this review.");
      return res.redirect(`/events/${eventId}`);
    }

    review.comment = req.body.review.comment;
    await review.save();
    logger.info(`Review updated with ID: ${reviewId}`);

    req.flash("success", "Review updated successfully.");
    res.redirect(`/events/${eventId}`);
  } catch (err) {
    logger.error("Error updating review:", err);
    req.flash("error", "Failed to update review.");
    res.redirect(`/events/${eventId}`);
  }
});

// Show all Reviews for an Event
module.exports.showReviews = wrapAsync(async (req, res) => {
  const eventId = req.params.id;
  logger.info(`Fetching reviews for event with ID: ${eventId}`);

  try {
    const event = await Event.findById(eventId).populate({
      path: "reviews",
      populate: { path: "reviewer" },
    });

    if (!event) {
      logger.info("Event not found.");
      req.flash("error", "Event does not exist!");
      return res.redirect("/events");
    }

    res.render("event/reviews", { event, cssFile: "event/reviews.css" });
  } catch (err) {
    logger.error("Error fetching reviews:", err);
    req.flash("error", "Failed to load reviews.");
    res.redirect("/events");
  }
});
