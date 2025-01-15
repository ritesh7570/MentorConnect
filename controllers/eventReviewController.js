const Event = require("../models/event");
const EventReview = require("../models/eventReview");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")('eventReviewController');


// Define methods
const index = wrapAsync(async (req, res) => {
  logger.info("Fetching all event reviews...");
  try {
    const eventReviews = await EventReview.find({})
      .populate("reviewer")
      .populate("event");
    logger.info(`Found ${eventReviews.length} event reviews.`);
    res.render("eventReviews/index", { eventReviews, cssFile: "eventReview/eventReviewIndex.css" });
  } catch (err) {
    logger.error("Error fetching event reviews:", err);
    req.flash("error", "Unable to retrieve event reviews at the moment.");
    res.redirect("/events");
  }
});

const create = wrapAsync(async (req, res) => {
  const eventId = req.params.id;
  logger.info(`Creating a new review for event with ID: ${eventId}`);
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      logger.warn("Event not found.");
      req.flash("error", "Event does not exist!");
      return res.redirect("/events");
    }

    const newReview = new EventReview(req.body.review);
    newReview.reviewer = req.user._id;
    newReview.event = eventId;
    await newReview.save();

    event.reviews.push(newReview._id);
    await event.save();

    logger.info("New review created with ID:", newReview._id);
    req.flash("success", "Review added successfully!");
    res.redirect(`/events/${eventId}`);
  } catch (err) {
    logger.error("Error creating review:", err);
    req.flash("error", "Failed to create review.");
    res.redirect(`/events/${eventId}`);
  }
});

const deleteReview = wrapAsync(async (req, res) => {
  const { id: eventId, reviewId } = req.params;
  logger.info(`Deleting review with ID: ${reviewId} from event: ${eventId}`);
  try {
    await EventReview.findByIdAndDelete(reviewId);

    await Event.findByIdAndUpdate(eventId, { $pull: { reviews: reviewId } });

    logger.info("Review deleted successfully:", reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/events/${eventId}`);
  } catch (err) {
    logger.error("Error deleting review:", err);
    req.flash("error", "Failed to delete review.");
    res.redirect(`/events/${eventId}`);
  }
});

const edit = wrapAsync(async (req, res) => {
  const { id: eventId, reviewId } = req.params;
  logger.info(`Fetching review with ID: ${reviewId} for editing in event: ${eventId}`);
  try {
    const review = await EventReview.findById(reviewId);

    if (!review) {
      logger.warn("Review not found.");
      req.flash("error", "Review does not exist!");
      return res.redirect(`/events/${eventId}`);
    }

    logger.info("Review found for editing:", review._id);
    res.render("eventReviews/edit", { review, eventId, cssFile: "eventReview/eventReviewEdit.css" });
  } catch (err) {
    logger.error("Error fetching review for editing:", err);
    req.flash("error", "Failed to load review for editing.");
    res.redirect(`/events/${eventId}`);
  }
});

const update = wrapAsync(async (req, res) => {
  const { id: eventId, reviewId } = req.params;
  logger.info(`Updating review with ID: ${reviewId} for event: ${eventId}`);
  logger.info("Request Body:", req.body);
  try {
    await EventReview.findByIdAndUpdate(reviewId, req.body.review, { new: true });

    logger.info("Review updated successfully:", reviewId);
    req.flash("success", "Review updated!");
    res.redirect(`/events/${eventId}`);
  } catch (err) {
    logger.error("Error updating review:", err);
    req.flash("error", "Failed to update review.");
    res.redirect(`/events/${eventId}`);
  }
});

// Export methods
module.exports = {
  index,
  create,
  deleteReview,
  edit,
  update,
};
