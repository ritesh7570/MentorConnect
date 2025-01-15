const Success = require("../models/success");
const SuccessReview = require("../models/successReview");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")('successReviewController'); // Specify label

// Create a new review for a success story
module.exports.create = wrapAsync(async (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`Creating review for success story with ID: ${id}`);

    const successStory = await Success.findById(id);
    if (!successStory) {
      logger.error(`Success story not found with ID: ${id}`);
      req.flash("error", "Success story not found.");
      return res.redirect("/successes");
    }

    const newReview = new SuccessReview(req.body.successReview);
    newReview.author = req.user._id;

    successStory.reviews.push(newReview);
    await newReview.save();
    await successStory.save();

    logger.info(`New review created and saved for success story with ID: ${id}`);

    req.flash("success", "New review created!");
    res.redirect(`/successes/${id}`);
  } catch (error) {
    logger.error(`Error creating review for success story with ID: ${id}`, error);
    req.flash("error", "Error creating review.");
    res.redirect(`/successes/${id}`);
  }
});

// Delete a review from a success story
module.exports.delete = wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  try {
    logger.info(`Deleting review with ID: ${reviewId} from success story with ID: ${id}`);

    const successStory = await Success.findById(id);
    if (!successStory) {
      logger.error(`Success story not found with ID: ${id}`);
      req.flash("error", "Success story not found.");
      return res.redirect("/successes");
    }

    const review = await SuccessReview.findById(reviewId);
    if (!review) {
      logger.error(`Review not found with ID: ${reviewId}`);
      req.flash("error", "Review not found.");
      return res.redirect(`/successes/${id}`);
    }

    // Remove review reference from success story and delete the review
    successStory.reviews.pull(reviewId);
    await successStory.save();
    await SuccessReview.findByIdAndDelete(reviewId);

    logger.info(`Review with ID: ${reviewId} successfully deleted from success story with ID: ${id}`);

    req.flash("success", "Review deleted!");
    res.redirect(`/successes/${id}`);
  } catch (error) {
    logger.error(`Error deleting review with ID: ${reviewId} from success story with ID: ${id}`, error);
    req.flash("error", "Error deleting review.");
    res.redirect(`/successes/${id}`);
  }
});

// Comment on a review (assumed to redirect to the comment section of the review)
module.exports.comment = wrapAsync(async (req, res) => {
  const { reviewId, id } = req.params;
  try {
    logger.info(`Commenting on review with ID: ${reviewId}`);

    const review = await SuccessReview.findById(reviewId);
    if (!review) {
      logger.error(`Review not found with ID: ${reviewId}`);
      req.flash("error", "Review not found.");
      return res.redirect(`/successes/${id}`);
    }

    logger.info(`Redirecting to comment section of success story with ID: ${id}`);
    res.redirect(`/successes/${id}#comment-section`);
  } catch (error) {
    logger.error(`Error commenting on review with ID: ${reviewId}`, error);
    req.flash("error", "Error commenting on review.");
    res.redirect(`/successes/${id}`);
  }
});
