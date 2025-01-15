const Donation = require("../models/donation");
const User = require("../models/user");
const Payment = require("../models/payment");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")('donationController'); // Specify label

module.exports.index = wrapAsync(async (req, res) => {
  logger.info("Fetching donations...");
  try {
    const filter = req.query.filter === "emergency" ? { isEmergency: true } : {};
    const donations = await Donation.find(filter)
      .populate({
        path: "payments",
        populate: {
          path: "donor",
          model: "User",
        },
      })
      .populate("owner");

    logger.info(`Found ${donations.length} donations.`);

    res.render("donations/index.ejs", {
      donations,
      cssFile: "donate/donateIndex.css",
    });
  } catch (err) {
    logger.error(`Error fetching donations: ${err.message}`);
    req.flash("error", "Unable to retrieve donations at the moment.");
    res.redirect("/");
  }
});

module.exports.renderNewForm = (req, res) => {
  logger.info("Rendering new donation form.");
  res.render("donations/new.ejs", { cssFile: "donate/donateNew.css" });
};

module.exports.create = wrapAsync(async (req, res) => {
  logger.info("Creating new donation...");
  try {
    const newDonation = new Donation(req.body.donation);
    newDonation.owner = req.user._id;
    await newDonation.save();
    
    // Push the new donation ID into the user's donations array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { donations: newDonation._id },
    });

    logger.info(`New donation created with ID: ${newDonation._id}`);
    req.flash("success", "New donation created!");
    res.redirect("/donations");
  } catch (err) {
    logger.error(`Error creating donation: ${err.message}`);
    req.flash("error", "Failed to create donation.");
    res.redirect("/donations");
  }
});

module.exports.show = wrapAsync(async (req, res) => {
  logger.info(`Fetching donation with ID: ${req.params.id}`);
  try {
    const donation = await Donation.findById(req.params.id)
      .populate({
        path: "payments",
        populate: {
          path: "donor",
        },
      })
      .populate("owner");

    if (!donation) {
      logger.warn("Donation not found.");
      req.flash("error", "Donation not found.");
      return res.redirect("/donations");
    }

    logger.info(`Donation found: ${donation._id}`);
    res.render("donations/show.ejs", {
      donation,
      cssFile: "donate/donateShow.css",
    });
  } catch (err) {
    logger.error(`Error fetching donation: ${err.message}`);
    req.flash("error", "Unable to retrieve the donation.");
    res.redirect("/donations");
  }
});

module.exports.renderEditForm = wrapAsync(async (req, res) => {
  logger.info(`Fetching donation for editing with ID: ${req.params.id}`);
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      logger.warn("Donation not found.");
      req.flash("error", "Donation not found.");
      return res.redirect("/donations");
    }
    res.render("donations/edit.ejs", {
      donation,
      cssFile: "donate/donateEdit.css",
    });
  } catch (err) {
    logger.error(`Error fetching donation for editing: ${err.message}`);
    req.flash("error", "Failed to load donation for editing.");
    res.redirect("/donations");
  }
});

module.exports.update = wrapAsync(async (req, res) => {
  logger.info(`Updating donation with ID: ${req.params.id}`);
  logger.info(`Request Body: ${JSON.stringify(req.body)}`);
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, {
      ...req.body.donation,
    }, { new: true });

    if (!donation) {
      logger.warn("Donation not found for update.");
      req.flash("error", "Donation not found.");
      return res.redirect("/donations");
    }

    logger.info(`Donation updated successfully: ${donation._id}`);
    req.flash("success", "Donation updated successfully.");
    res.redirect(`/donations/${req.params.id}`);
  } catch (err) {
    logger.error(`Error updating donation: ${err.message}`);
    req.flash("error", "Failed to update donation.");
    res.redirect("/donations");
  }
});

module.exports.delete = wrapAsync(async (req, res) => {
  logger.info(`Deleting donation with ID: ${req.params.id}`);
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      logger.warn("Donation not found for deletion.");
      req.flash("error", "Donation not found.");
      return res.redirect("/donations");
    }
    logger.info(`Donation deleted successfully: ${donation._id}`);
    req.flash("success", "Donation deleted successfully.");
    res.redirect("/donations");
  } catch (err) {
    logger.error(`Error deleting donation: ${err.message}`);
    req.flash("error", "Failed to delete donation.");
    res.redirect("/donations");
  }
});

module.exports.createPayment = wrapAsync(async (req, res) => {
  logger.info(`Creating payment for donation with ID: ${req.params.id}`);
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      logger.warn("Donation not found for payment creation.");
      req.flash("error", "Donation not found.");
      return res.redirect("/donations");
    }

    const payment = new Payment(req.body.payment);
    payment.donor = req.user._id;
    await payment.save();

    donation.payments.push(payment._id);
    donation.totalCollection += payment.amount; // Update total collection
    await donation.save();

    logger.info(`Payment created and added to donation with ID: ${donation._id}`);
    req.flash("success", "Thank you for your donation!");
    res.redirect(`/donations/${req.params.id}`);
  } catch (err) {
    logger.error(`Error creating payment: ${err.message}`);
    req.flash("error", "Failed to process your payment.");
    res.redirect(`/donations/${req.params.id}`);
  }
});
