const mongoose = require("mongoose");
const logger = require("../utils/logger")('eventValidationMware');
const { validationResult } = require("express-validator");
const Event = require("../models/event");

module.exports.validateEvent = async (req, res, next) => {
  try {
    console.log("validating event...........................");
    console.log("validation req.body.event");
    console.log(req.body.event);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errors: ", errors.array());
      throw new Error(errors.array().map((error) => error.msg));
    }
    const { title, description, date, time, isOnline, venue, link, chiefGuests, donation, group } = req.body.event;
    // Chief Guest: Handle string name + image (via multer)
    let chiefGuestData = { name: "", image: { url: "", filename: "" } };
    if (chiefGuests) {
      if (chiefGuests.name) {
        chiefGuestData.name = chiefGuests.name;
      }
      if (req.file && req.file.fieldname === "chiefGuestImage") {
        chiefGuestData.image.url = req.file.path;  
        chiefGuestData.image.filename = req.file.filename;
      }
    }

    // Convert donation/group IDs to ObjectId if valid
    const donationId = donation && mongoose.isValidObjectId(donation) ? new mongoose.Types.ObjectId(donation) : null;
    const groupId = group && mongoose.isValidObjectId(group) ? new mongoose.Types.ObjectId(group) : null;

    // Convert boolean fields from string to boolean
    const isOnlineEvent = (isOnline === "true");

    // Handle Event Poster (from multer)
    let eventPoster = { url: "", filename: "" };
    if (req.file && req.file.fieldname === "eventPoster") {
      eventPoster = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Default values for non-required fields
    const eventData = {
      title,
      description: description || "No description provided",
      date,
      time: time || "00:00",
      isOnline: isOnlineEvent,
      venue: isOnlineEvent ? "" : venue || "",
      link: isOnlineEvent ? link || "" : "",
      chiefGuests: chiefGuestData,
      donation: donationId,
      group: groupId,
      poster: eventPoster,
    };

    // Attach processed data to req.body
    req.body.event = eventData;
    next();
  } catch (err) {
    logger.error(`Error during event preprocessing: ${err}`);
    res.status(500).send("Server error during event processing.");
  }
};



module.exports.isOrganiser = async (req, res, next) => {
  const eventId = req.params.id; // Assuming the event ID is passed in the URL
  logger.info(`Checking if user is organiser for event ID: ${eventId}`);

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      logger.error("Event not found.");
      throw new ExpressError(404, "Event not found.");
    }

    if (!event.organiser.equals(req.user._id)) {
      logger.error("User is not the organiser.");
      throw new ExpressError(403, "You do not have permission to perform this action.");
    }

    next(); // User is the organiser, proceed to the next middleware/route handler
  } catch (err) {
    logger.error("Error checking organiser:", err);
    next(err); // Pass the error to the next middleware
  }
};
