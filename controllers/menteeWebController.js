const Mentee = require("../models/mentee/mentee");
const Mentor = require("../models/mentor/mentor");
const mongoose = require('mongoose');
const Booking = require("../models/bookingModel"); // Ensure the model is imported
const wrapAsync = require("../utils/wrapAsync");

const menteeService = require("../services/menteeService");
const mentorService = require("../services/mentorService");
const userService = require("../services/userService");
const { validationResult } = require("express-validator");
const MenteeConnectionService = require("../services/menteeConnectionService");
const ConnectionRequest = require("../models/connectionRequest");

//scheduling
module.exports.renderParticularMentorScheduleForMentee = async (req, res) => {
  try {
    const mentorUserId = req.params.mentorUserId;
    const menteeUserId = req.user._id; // Logged-in mentee's ID

    // Fetch all bookings where the specified user is the mentor and status is not "deleted"
    const bookings = await Booking.find({ mentorUserId: mentorUserId, status: { $ne: "deleted" } })
      .populate("menteeUserId") // Populate mentee details
      .exec();

    // Format bookings for FullCalendar
    const formattedBookings = bookings.map((booking) => {
      const isCurrentMentee =
        booking.menteeUserId?._id.toString() === menteeUserId.toString();

      if (isCurrentMentee) {
        // Full details if the booking belongs to the logged-in mentee
        return {
          bookingId: booking._id.toString(), // Booking ID
          title: `Session with ${
            booking.menteeUserId ? booking.menteeUserId.username : "Mentee"
          }`, // Use mentee's username
          start: booking.schedule.start.toISOString(), // Start date
          end: booking.schedule.end.toISOString(), // End date
          status: booking.status, // Include booking status
          reason: booking.bookingReason || "", // Default to empty string if no reason
          paymentStatus: booking.payment
            ? `Payment done with ${booking.payment.toString()}`
            : "Payment not done", // Check for payment and format accordingly
        };
      } else {
        // General details for bookings not belonging to the logged-in mentee
        return {
          bookingId: "******", // Mask the booking ID
          title: "Mentor Session", // Generic title
          start: booking.schedule.start.toISOString(), // Start date
          end: booking.schedule.end.toISOString(), // End date
          status: "scheduled", // Default status for anonymized details
          paymentStatus: "done",
        };
      }
    });

    // Render the schedule page and pass the bookings data
    res.render("mentee/booking/index.ejs", {
      userRole: "mentee", // Render the page for a mentee
      bookings: formattedBookings, // Pass formatted bookings to the template
      menteeUserId: req.user.id,
      mentorUserId: mentorUserId, // Pass mentor ID to the template
      pricePerSlot: 50, // Example price per slot
    });
  } catch (err) {
    console.error("Error fetching mentor schedule:", err);
    res.status(500).send("An error occurred while fetching your schedule.");
  }
};


module.exports.dashboard = (req, res) => {
  // res.render("mentee/home/home",{cssFile:"/mentee/home/index.css"});
  res.redirect("mentee/connections");
};

module.exports.viewProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("try to view mentee profile................................");

    const mentee = await menteeService.getMenteeByUserId(userId);

    if (!mentee) {
      req.flash("error", "Mentee not found.");
      return res.redirect("/");
    }
    console.log("Mentee retrieved: " + JSON.stringify(mentee));

    const isOwner = mentee.user._id.toString() === req.user._id.toString();

    res.render("mentee/profile/index", { mentee, isOwner ,cssFile:"mentee/profile/index.css"});
  } catch (error) {
    console.error("Error fetching mentee profile: ", error);
    req.flash("error", "An error occurred while fetching the profile.");
    res.redirect("/");
  }
};

module.exports.renderEditProfile = async (req, res) => {
  const userId = req.user._id;
  const mentee = await menteeService.getMenteeByUserId(userId);
  res.render("mentee/profile/edit", { mentee,cssFile:"mentee/profile/edit.css" });
};

module.exports.editProfile = async (req, res) => {
  const paramsId = req.params.id;
  const userId = req.user._id;

  try {
    const mentee = await menteeService.getMenteeByUserId(userId);

    if (!mentee || mentee.user._id.toString() !== userId.toString()) {
      req.flash("error", "You do not have permission to edit this profile.");
      return res.redirect(`/mentee/profile/${paramsId}`);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("mentee/profile/edit", {
        mentee,
        errors: errors.array(),
      });
    }

    const updatedData = {
      goals: req.body.goals,
      educationLevel: req.body.educationLevel,
      bio: req.body.bio,
    };

    await menteeService.updateMentee(mentee._id, updatedData);
    req.flash("success", "Profile updated successfully!");
    res.redirect(`/mentee/profile/${paramsId}`);
  } catch (error) {
    console.error("Error updating mentee profile: ", error);
    req.flash("error", "An error occurred while updating the profile.");
    res.redirect(`/mentee/profile/${paramsId}`);
  }
};

module.exports.deleteProfile = async (req, res) => {
  const paramsId = req.params.id;
  const userId = req.user._id;

  try {
    const mentee = await menteeService.getMenteeByUserId(paramsId);

    if (!mentee || mentee.user._id.toString() !== userId.toString()) {
      req.flash("error", "You do not have permission to delete this profile.");
      return res.redirect(`/mentee/profile/${paramsId}`);
    }

    await menteeService.deleteMentee(mentee._id);
    await userService.deleteUserById(userId);

    req.logout((err) => {
      if (err) {
        req.flash(
          "error",
          "An error occurred during logout. Please try again."
        );
        return res.redirect(`/mentee/profile/${paramsId}`);
      }
      req.flash("success", "Your profile has been deleted successfully.");
      res.redirect("/");
    });
  } catch (error) {
    console.error("Error deleting mentee profile and user: ", error);
    req.flash("error", "An error occurred while deleting the profile.");
    res.redirect(`/mentee/profile/${paramsId}`);
  }
};



module.exports.displayMentorList = async (req, res) => {
  //when he search for add new mentor
  try {
    // Fetch the mentee's details
    const mentee = await Mentee.findOne({ user: req.user._id })
      .populate("connections")
      .exec();

    // Fetch all mentors
    const mentors = await Mentor.find().populate("user").exec();

    // Add connection status for each mentor
    for (const mentor of mentors) {
      const connectionRequest = await ConnectionRequest.findOne({
        mentee: mentee._id,
        mentor: mentor._id,
      });

      if (mentee.connections.includes(mentor._id)) {
        mentor.connectionStatus = "connected"; // Already connected
      } else if (connectionRequest) {
        mentor.connectionStatus = connectionRequest.status; // Pending or Accepted/Rejection
      } else {
        mentor.connectionStatus = "none"; // No connection request sent
      }
    }

    // Render the mentor list page with the connection status and CSS file
    res.render("mentee/connection/mentorList", {
      mentors,
      cssFile: "mentee/connection/mentorList.css",
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).send("An error occurred while fetching mentors.");
  }
};

module.exports.displayAllConnections = async (req, res) => {
  // display all connected mentor
  try {
    // Find the mentee using the logged-in user's ID
    const mentee = await Mentee.findOne({ user: req.user._id }).populate({
      path: "connections",
      populate: { path: "user" }, // Populate mentor details along with their user details
    });

    if (!mentee) {
      return res.status(404).send("Mentee profile not found");
    }

    // Send the list of connected mentors along with logged-in user ID
    res.render("mentee/connection/index", {
      loggedInUserId: req.user._id, // Pass the logged-in user's ID
      connectedMentors: mentee.connections, // Array of connected mentors
      cssFile:"/mentee/connection/index.css"
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.connectRequest = async (req, res) => {
  console.log("connectRequest");

  const { mentorId } = req.params; // Mentor ID from the URL
  const menteeId = req.user._id; // Mentee ID from the logged-in user
  console.log("Mentee send request ");

  const result = await MenteeConnectionService.sendConnectionRequest(
    menteeId,
    mentorId
  );
  console.log(
    "Sent request to MenteeConnectionService with success message " +
      JSON.stringify(result)
  );

  // Handle response from the service
  if (result.success) {
    req.flash("success", result.message);
  } else {
    req.flash("error", result.message);
  }
  res.redirect("/mentee/mentorList");
};
module.exports.cancelRequest = async (req, res) => {
  try {
    const userId = req.user._id; // Get the current mentee's ID
    const mentorId = req.params.mentorId;

    // Find the mentee document
    const menteeDocument = await Mentee.findOne({ user: userId });
    if (!menteeDocument) {
      return res.status(404).send("Mentee not found.");
    }

    const menteeId = menteeDocument._id;
    console.log("Mentee ID:", menteeId);

    // Find the connection request
    const connectionRequest = await ConnectionRequest.findOne({
      mentee: menteeId,
      mentor: mentorId,
      status: "pending",
    });

    if (!connectionRequest) {
      return res.status(404).send("No pending request found to cancel.");
    }

    // Remove the connection request
    await ConnectionRequest.findByIdAndDelete(connectionRequest._id);
    console.log(`Connection request ${connectionRequest._id} removed.`);
    // Update Mentor and Mentee's pendingRequests
    const mentor = await Mentor.findById(mentorId);
    const mentee = await Mentee.findById(menteeId);

    if (mentor && mentee) {
      mentor.pendingRequests = mentor.pendingRequests.filter(
        (req) => req.toString() !== connectionRequest._id.toString()
      );
      mentee.pendingRequests = mentee.pendingRequests.filter(
        (req) => req.toString() !== connectionRequest._id.toString()
      );

      await mentor.save();
      await mentee.save();
    }

    // Flash success message and redirect
    req.flash("success", "Connection request has been cancelled.");
    res.redirect("/mentee/mentorList");
  } catch (error) {
    console.error("Error cancelling connection request:", error.stack);
    res.status(500).send("An error occurred while cancelling the request.");
  }
};


module.exports.disconnect = async (req, res) => {
  try {
    const userId = req.user._id; // Current mentee's ID (assuming authenticated user is a mentee)
    const mentorId = req.params.mentorId; // ID of the mentor to disconnect from

    // Find the mentee document
    const menteeDocument = await Mentee.findOne({ user: userId });
    if (!menteeDocument) {
      return res.status(404).send("Mentee not found.");
    }

    const menteeId = menteeDocument._id;

    // Find the mentor document
    const mentorDocument = await Mentor.findById(mentorId);
    if (!mentorDocument) {
      return res.status(404).send("Mentor not found.");
    }

    // Remove connection from mentee's connections
    menteeDocument.connections = menteeDocument.connections.filter(
      (connection) => connection.toString() !== mentorId.toString()
    );

    // Remove connection from mentor's connections
    mentorDocument.connections = mentorDocument.connections.filter(
      (connection) => connection.toString() !== menteeId.toString()
    );

    // Save updated documents
    await menteeDocument.save().catch(err => {
      console.error("Error saving mentee:", err);
      throw err;
    });

    await mentorDocument.save().catch(err => {
      console.error("Error saving mentor:", err);
      throw err;
    });

    // Optionally remove any pending or existing ConnectionRequest between them
    await ConnectionRequest.deleteMany({
      mentee: menteeId,
      mentor: mentorId,
    });

    // Flash success message and redirect
    req.flash("success", "You have successfully disconnected from the mentor.");
    res.redirect("/mentee/mentorList");
  } catch (error) {
    console.error("Error disconnecting:", error.stack);
    res.status(500).send("An error occurred while disconnecting.");
  }
};


// A model to store payment information

module.exports.handleBookSlot = async (req, res) => {
  console.log("Book slot started");

  try {
    const {
      start,
      end,
      reason,
      totalPrice,
      mentorUserId,
      menteeUserId,
      title,
    } = req.body;

    // Step 1: Temporarily save received data with a pending status
    const booking = new Booking({
      menteeUserId: menteeUserId, // ID of the mentee
      mentorUserId: mentorUserId, // ID of the mentor
      status: "pending", // Default status
      schedule: {
        start: start, // Start time of the booking
        end: end, // End time of the booking
      },
      title: title, // Booking title
      bookingReason: reason, // Reason for the booking
    });

    console.log(" before Booking save");

    await booking.save();
    console.log("after Booking save");

    // Step 2: Render payment page
    console.log("rendering payment page.....");

    res.render("mentee/booking/payment.ejs", {
      bookingId: booking._id,
      totalPrice,
      menteeUserId,
      mentorUserId,
    });
  } catch (error) {
    console.error("Error during slot booking:", error);
    req.flash("error", "An error occurred while processing your request.");
    res.redirect("/mentee/booking"); // Redirect back to booking page with error
  }
};


//schedule
module.exports.renderMentorScheduleForMentee = async (req, res) => {
  try {
    // Fetch the logged-in user's ID (mentee) and the mentor's ID
    const menteeId = req.user._id;
    const mentorId = req.params.mentorId;

    // Fetch all bookings for the specified mentor
    const bookings = await Booking.find({ mentorUserId: mentorId })
      .populate("mentorUserId") // Populate mentor details
      .populate("menteeUserId") // Populate mentee details
      .exec();

    // Format bookings for FullCalendar
    const formattedBookings = bookings.map((booking) => {
      // If the booking is for the logged-in mentee, provide full details
      if (booking.menteeUserId && booking.menteeUserId._id.equals(menteeId)) {
        return {
          bookingId: booking._id.toString(),
          title: `Session with ${
            booking.mentorUserId ? booking.mentorUserId.username : "Mentor"
          }`,
          start: booking.schedule.start.toISOString(),
          end: booking.schedule.end.toISOString(),
          status: booking.status,
          reason: booking.reason || "",
        };
      } else {
        // For other mentees' bookings, provide only general details
        return {
          bookingId: booking._id.toString(),
          title: "Scheduled",
          start: booking.schedule.start.toISOString(),
          end: booking.schedule.end.toISOString(),
          status: "scheduled", // Hide the exact status for other mentees
          reason: "", // No reason provided
        };
      }
    });

    // Render the schedule page and pass the bookings data
    res.render("mentee/booking/index.ejs", {
      userRole: "mentee", // Render the page for a mentee
      bookings: formattedBookings, // Pass formatted bookings to the template
    });
  } catch (err) {
    console.error("Error fetching mentee schedule:", err);
    res.status(500).send("An error occurred while fetching the mentor's schedule.");
  }
};


module.exports.cancelBookRequest= wrapAsync(async (req, res) => {
  const { bookingId, reason } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).send("Booking not found.");
  booking.status = "cancelled";
  booking.reason = reason;
  await booking.save();
  res.send("Booking cancelled.");
});

module.exports.reverseCancelBookRequest=  wrapAsync(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).send("Booking not found.");
  booking.status = "confirmed";
  booking.reason = "";
  await booking.save();
  res.send("Booking restored.");
});
