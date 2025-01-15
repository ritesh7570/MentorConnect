const Donation = require("../models/donation");
const { donationSchema } = require("../schemas/donationSchema");
const ExpressError = require("../utils/expressError");
const logger = require("../utils/logger")('donationMiddleware');

module.exports.isDonationOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Checking ownership for donation ID: ${id}`);

    const donation = await Donation.findById(id);
    
    if (!donation) {
      logger.warn(`Donation with ID: ${id} not found`);
      req.flash("error", "Donation not found.");
      return res.redirect("/donations");
    }

    logger.info(`Donation owner ID: ${donation.owner}, Logged-in user ID: ${req.user._id}`);

    if (!donation.owner.equals(req.user._id)) {
      logger.warn("Ownership mismatch. User is not authorized.");
      req.flash("error", "You do not have permission to modify this donation.");
      return res.redirect(`/donations/${id}`);
    }

    logger.info("Ownership confirmed. Proceeding to the next middleware.");
    next();
  } catch (err) {
    logger.error(`Error in isDonationOwner middleware: ${err.message}`);
    req.flash("error", "An error occurred while checking ownership.");
    next(err);
  }
};

module.exports.validateDonation = (req, res, next) => {
  try {
    logger.info("Validating donation schema...");
    logger.debug(`Request body before conversion: ${JSON.stringify(req.body)}`);
    console.log("donation 1, req.body.donation: ",req.body.donation);
    // Convert isEmergency to a boolean
    req.body.donation.isEmergency = req.body.donation.isEmergency === 'true';
    console.log("donation 2");
    
    // Ensure fundraisingGoal is set to 0 if not provided
    req.body.donation.fundraisingGoal = req.body.donation.fundraisingGoal || 0;
    console.log("donation 3");
    // Set deadlineDate to null if not provided
    if (!req.body.donation.deadlineDate) {
      req.body.donation.deadlineDate = null;
    }
    console.log("donation 4");

    logger.debug(`Request body after conversion: ${JSON.stringify(req.body)}`);
    console.log("donation 5, req.body.donation: ",req.body.donation);
    const { error } = donationSchema.validate(req.body.donation);
console.error( "error", error);

    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      logger.error(`Validation error: ${msg}`);
      throw new ExpressError(msg, 400);
    }

    logger.info("Donation schema validation passed. Proceeding to the next middleware.");
    next();
  } catch (err) {
    logger.error(`Error in validateDonation middleware: ${err.message}`);
    req.flash("error", "Validation failed. Please check your input.");
    next(err);
  }
};
