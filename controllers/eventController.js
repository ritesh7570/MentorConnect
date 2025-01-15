const mongoose = require("mongoose");
const Event = require("../models/event");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")("eventController");
const ExpressError = require("../utils/expressError");
const { uploadFile } = require("../services/uploadService");
const { deleteImage } = require("../services/deleteImageService");

// Create
module.exports.create = wrapAsync(async (req, res, next) => {
  console.info("Creating a new event...");
  try {
    const { title, description, date, time, isOnline, link, venue } =
      req.body.event;

    // Handle event poster upload
    const uploadedPoster = req.file ? await uploadFile(req.file) : null;

    // Construct the event object based on form input
    const event = new Event({
      title,
      description,
      date,
      time,
      isOnline: isOnline === "true", // Convert "true"/"false" to boolean
      link: isOnline === "true" ? link : null,
      venue: isOnline !== "true" ? venue : null,
      poster: uploadedPoster
        ? {
            url: uploadedPoster.url,
            publicId: uploadedPoster.publicId,
          }
        : null,
      organiser: req.user._id, // Assuming organiser is the logged-in user
    });

    // Save the event in the database
    await event.save();

    console.info(`New event created with ID: ${event._id}`);
    req.flash("success", "Event created successfully!");
    res.redirect("/events");
    // res.redirect(`/events/${event._id}`);
  } catch (err) {
    console.error("Error creating event:", err);
    next(err); // Pass error to error handler
  }
});

// Index
module.exports.index = wrapAsync(async (req, res) => {
  console.info("Fetching all events...");
  try {
    const events = await Event.find({})
      .populate("likes")
      .populate("joinMembers")
      .populate("organiser");
    console.info(`Found ${events.length} events.`);
    // console.log(
    //   "................................................................"
    // );
    // console.log(events[0].poster.toString().charAt(0));
    // console.log(".....");

    // console.log(events[1].poster.toString().charAt(0));
    // console.log(".....");

    // console.log(events[2].poster.toString().charAt(0));
    // if (events[0].poster && events[0].poster instanceof mongoose.Types.Document && events[0].poster.toString() === 'null') {
    //   console.log("poster is MongooseDocument { null }");
    // } else if (events[0].poster) {
    //   console.log("poster exists and is:", events[0].poster);
    // } else {
    //   console.log("poster is undefined or null");
    // }

    res.render("events/index", { events, cssFile: "event/eventIndex.css" });
  } catch (err) {
    console.error("Error fetching events:", err);
    throw new ExpressError(500, "Error fetching events.");
  }
});

// Show
module.exports.show = wrapAsync(async (req, res) => {
  const eventId = req.params.id;
  console.info(`Fetching event with ID: ${eventId}`);
  try {
    const event = await Event.findById(eventId)
      .populate("likes")
      .populate("joinMembers")
      .populate("organiser");

    if (!event) {
      console.error("Event not found.");
      throw new ExpressError(404, "Event not found.");
    }

    const isLiked = event.likes.includes(req.user ? req.user._id : null);
    res.render("events/show", {
      event,
      isLiked,
      cssFile: "event/eventShow.css",
    });
  } catch (err) {
    console.error("Error fetching event:", err);
    throw new ExpressError(500, "Error fetching event.");
  }
});

// New
module.exports.new = (req, res) => {
  console.info("Rendering new event form.");
  res.render("events/new", { cssFile: "event/eventNew.css" });
};

// Edit
module.exports.edit = wrapAsync(async (req, res) => {
  const eventId = req.params.id;
  console.info(`Rendering edit form for event ID: ${eventId}`);
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      console.error("Event not found for editing.");
      throw new ExpressError(404, "Event not found.");
    }
    res.render("events/edit", { event, cssFile: "event/eventEdit.css" });
  } catch (err) {
    console.error("Error rendering edit form:", err);
    throw new ExpressError(500, "Error rendering edit form.");
  }
});

// Update
module.exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, isOnline, venue, link } =
      req.body.event;

    // Find the existing event
    const event = await Event.findById(id);

    if (!event) {
      req.flash("error", "Event not found!");
      return res.redirect("/events");
    }

    // Update event fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.isOnline = isOnline === "true"; // Ensure boolean conversion
    event.venue = isOnline === "false" ? venue : null; // Venue only for offline events
    event.link = isOnline === "true" ? link : null; // Link only for online events

    // Handle poster update
    if (req.file) {
      // Delete the old poster if it exists
      if (event.poster) {
        await deleteImage(event.poster); // Reuse the deleteImage service
      }

      // Upload the new poster
      const uploadedPoster = await uploadFile(req.file); // Handles both local and Cloudinary
      event.poster = {
        url: uploadedPoster.url,
        publicId: uploadedPoster.publicId,
      };
    }

    // Save the updated event
    await event.save();

    req.flash("success", "Event updated successfully!");
    res.redirect(`/events/${id}`);
  } catch (error) {
    console.error("Error updating event:", error);
    next(error); // Pass the error to the error-handling middleware
  }
};
module.exports.delete = wrapAsync(async (req, res) => {
  const { id } = req.params;
  try {
    console.info(`Deleting event with ID: ${id}`);

    // Find the event
    const event = await Event.findById(id);

    if (!event) {
      console.error(`Event not found with ID: ${id}`);
      req.flash("error", "Event does not exist!");
      return res.redirect("/events");
    }

    console.log("poster: " + event.poster);

    // Delete associated poster
    if (event.poster && event.poster.toString().charAt(0) === "{") {
      await deleteImage(event.poster);
    } else {
      console.log("No valid poster found.");
    }
    // Delete the event from the database
    await Event.findByIdAndDelete(id);

    req.flash("success", "Event deleted!");
    res.redirect("/events");

    console.info(`Successfully deleted event with ID: ${id}`);
  } catch (error) {
    console.error(`Error deleting event with ID: ${id}`, error);
    req.flash("error", "Error deleting event.");
    res.redirect("/events");
  }
});

// Join
module.exports.join = wrapAsync(async (req, res) => {
  const eventId = req.params.id;
  console.info(`User joining event ID: ${eventId}`);
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new ExpressError(404, "Event not found.");

    // Check if the user has already joined the event
    if (!event.joinMembers.includes(req.user._id)) {
      event.joinMembers.push(req.user._id);
      await event.save();
      req.flash("success", "You have joined the event!");
    } else {
      req.flash("info", "You are already a member of this event.");
    }
    // Store redirect URL
    res.locals.redirectUrl = req.get("referer"); // Redirect back to the previous page
    res.redirect(res.locals.redirectUrl);
  } catch (err) {
    console.error("Error joining event:", err);
    throw new ExpressError(500, "Error joining event.");
  }
});

// Leave
module.exports.leave = wrapAsync(async (req, res) => {
  const eventId = req.params.id;
  console.info(`User leaving event ID: ${eventId}`);
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new ExpressError(404, "Event not found.");

    // Remove the user from the joined members
    event.joinMembers.pull(req.user._id);
    await event.save();

    req.flash("success", "You have left the event!");
    // Store redirect URL
    res.locals.redirectUrl = req.get("referer"); // Redirect back to the previous page
    res.redirect(res.locals.redirectUrl);
  } catch (err) {
    console.error("Error leaving event:", err);
    throw new ExpressError(500, "Error leaving event.");
  }
});

// Like
module.exports.like = wrapAsync(async (req, res) => {
  const eventId = req.params.id;
  console.info(`User toggling like for event ID: ${eventId}`);
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new ExpressError(404, "Event not found.");

    const hasLiked = event.likes.includes(req.user._id);
    if (hasLiked) {
      event.likes.pull(req.user._id);
    } else {
      event.likes.push(req.user._id);
    }

    await event.save();
    req.flash(
      "success",
      `You have ${hasLiked ? "unliked" : "liked"} the event.`
    );
    // Store redirect URL
    res.locals.redirectUrl = req.get("referer"); // Redirect back to the previous page
    res.redirect(res.locals.redirectUrl);
  } catch (err) {
    console.error("Error liking event:", err);
    throw new ExpressError(500, "Failed to like event.");
  }
});

// Report
module.exports.report = wrapAsync(async (req, res) => {
  const eventId = req.params.id;
  console.info(`User reporting event ID: ${eventId}`);
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new ExpressError(404, "Event not found.");
    event.reports.push(req.user._id);
    await event.save();
    req.flash("success", "Event reported!");
    res.locals.redirectUrl = req.get("referer"); // Redirect back to the previous page
    res.redirect(res.locals.redirectUrl);
  } catch (err) {
    console.error("Error reporting event:", err);
    throw new ExpressError(500, "Error reporting event.");
  }
});
