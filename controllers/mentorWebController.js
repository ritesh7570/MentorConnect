// controllers/mentorWebController.js

const Mentor = require("../models/mentor/mentor");
const Mentee = require("../models/mentee/mentee");
const mongoose = require("mongoose");
const Booking = require("../models/bookingModel"); // Ensure the model is imported
const ConnectionRequest = require("../models/connectionRequest");
const mentorService = require("../services/mentorService");
const userService = require("../services/userService");
const { validationResult } = require("express-validator");


module.exports.renderMentorOwnSchdule = async (req, res) => {
  try {
    // Fetch the logged-in user's mentor ID
    const mentorId = req.user._id;

    // Fetch all bookings where the logged-in user is the mentor
    const bookings = await Booking.find({
      mentorUserId: mentorId,
      status: { $ne: "deleted" },
    })
      .populate("menteeUserId") // Populate mentee details
      .exec();

    console.log(
      "................................................................"
    );

    // Format bookings for FullCalendar
    const formattedBookings = bookings.map((booking) => ({
      bookingId: booking._id.toString(), // Add the booking ID to the formatted data
      title: `Session with ${
        booking.menteeUserId ? booking.menteeUserId.username : "Mentee"
      }`, // Use mentee's username
      start: booking.schedule.start.toISOString(), // Convert date to ISO string
      end: booking.schedule.end.toISOString(), // Convert date to ISO string
      status: booking.status, // Include booking status
      reason: booking.reason || "", // Default to empty string if no reason
      paymentStatus: booking.payment
        ? `Payment done with ${booking.payment.toString()}`
        : "Payment not done", // Check for payment and format accordingly
    }));

    // console.log(formattedBookings);
    // Render the schedule page and pass the bookings data
    res.render("mentor/booking/index.ejs", {
      userRole: "mentor", // Render the page for a mentor
      bookings: formattedBookings, // Pass formatted bookings to the template
    });
  } catch (err) {
    console.error("Error fetching mentor schedule:", err);
    res.status(500).send("An error occurred while fetching your schedule.");
  }
};

module.exports.updateMentorOwnSchdule= async (req, res) => {
  console.log("Updating schedule: Received request body:");
  console.log(req.body);

  const { bookingId, status, reason } = req.body; // Extract bookingId, status, and reason

  // Step 1: Validate input
  if (!bookingId || !status) {
    console.error("Error: Missing required fields in the request body.");
    return res.status(400).send({ 
      message: "Invalid request: bookingId and status are required fields." 
    });
  }

  try {
    // Step 2: Convert bookingId to ObjectId if it's a string and the field in DB is an ObjectId
    let bookingQuery = { bookingId };
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      bookingQuery = { _id: new mongoose.Types.ObjectId(bookingId) }; // Correct instantiation of ObjectId
    }

    console.log(`Searching for booking with bookingId: ${bookingId}`);
    const booking = await Booking.findOne(bookingQuery); // Use the correct query format
    console.log("Booking query executed.");

    if (booking) {
      console.log(`Booking found. Updating bookingId: ${bookingId}`);

      // Step 3: Update booking fields
      booking.status = status;
      booking.reason = reason;

      console.log(`Saving updated booking with bookingId: ${bookingId}`);
      await booking.save(); // Save changes to the database
      console.log("Booking saved successfully.");

      // Step 4: Send success response
      return res.status(200).send({ message: "Booking updated successfully" });
    } else {
      console.error(`Error: Booking with bookingId ${bookingId} not found.`);
      return res.status(404).send({ 
        message: `Booking not found: No booking exists with bookingId ${bookingId}` 
      });
    }
  } catch (error) {
    // Step 5: Handle errors
    console.error("Error during booking update:", error);
    return res.status(500).send({ 
      message: "Internal server error. Please try again later." 
    });
  }
};


// module.exports.dashboard = (req, res) => {
//   res.render("mentor/home/home", {
//     cssFile: "mentor/home/index.css",
//   });
// };



module.exports.dashboard = (req, res) => {
  res.redirect("mentor/connection");
  // res.render('mentor/home/home', {
  //   cssFile:"mentor/home/index.css",
  //   mentorName: 'John Doe',
  //   groups: [
  //     { name: 'Web Development Enthusiasts', description: 'Learning the latest in web technologies.' },
  //     { name: 'Data Science Learners', description: 'Exploring data and building models.' }
  //   ],
  //   mentees: [
  //     { name: 'Alice Johnson', role: 'Web Developer' },
  //     { name: 'Bob Smith', role: 'Data Scientist' }
  //   ],
  //   successStories: [
  //     { name: 'Alice Johnson', achievement: 'Landed a job as a Frontend Developer.' },
  //     { name: 'Bob Smith', achievement: 'Published a groundbreaking AI paper.' }
  //   ],
  //   thoughtOfTheDay: 'Empowering success stories, one mentee at a time!'
  // });
};


module.exports.viewProfile = async (req, res) => {
  try {
    // Fetch the mentor by the user ID from the params
    const userId = req.params.id;

    // Find the mentor by user ID
    const mentor = await mentorService.getMentorByUserId(userId);

    if (!mentor) {
      req.flash("error", "Mentor not found.");
      console.log("Mentor not found");
      return res.redirect("/");
    }

    const isOwner = mentor.user._id.toString() === req.user._id.toString(); // Check if logged-in user is the owner
    console.log("isOwner: " + isOwner);
    console.log("mentor: " + mentor.user._id);
    console.log("user: " + req.user._id);

    // Render the profile page and pass mentor data and ownership status
    res.render("mentor/profile/index", { mentor, isOwner,cssFile: "mentor/profile/index.css" });
  } catch (error) {
    console.error("Error fetching mentor profile: ", error);
    req.flash("error", "An error occurred while fetching the profile.");
    res.redirect("/");
  }
};

module.exports.renderEditProfile = async (req, res) => {
  let userId = req.user._id;
  const mentor = await mentorService.getMentorByUserId(userId);
  console.log("Mentor retrieved successfully for user " + userId);
  console.log("mentor: ", mentor);

  res.render("mentor/profile/edit", { mentor: mentor,cssFile:"/mentor/profile/edit.css" });
};
// Edit Profile Controller
module.exports.editProfile = async (req, res) => {
  const paramsId = req.params.id;
  const userId = req.user._id;
  console.log(
    "edit controller...................................................."
  );
  console.log("paramsId", paramsId);
  console.log("userId", userId);

  try {
    const mentor = await mentorService.getMentorByUserId(userId);

    if (!mentor || mentor.user._id.toString() !== userId.toString()) {
      req.flash("error", "You do not have permission to edit this profile.");
      return res.redirect(`/mentor/profile/${paramsId}`);
    }

    const mentorId = mentor._id;
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("mentor/profile/edit", {
        mentor,
        errors: errors.array(),
      });
    }

    const updatedData = {
      expertise: req.body.expertise,
      yearsOfExperience: req.body.yearsOfExperience,
      bio: req.body.bio,
      linkedIn: req.body.linkedIn,
      twitter: req.body.twitter,
      github: req.body.github,
      portfolio: req.body.portfolio,
    };

    await mentorService.updateMentor(mentorId, updatedData);
    req.flash("success", "Profile updated successfully!");
    res.redirect(`/mentor/profile/${paramsId}`);
  } catch (error) {
    console.error("Error updating mentor profile: ", error);
    req.flash("error", "An error occurred while updating the profile.");
    res.redirect(`/mentor/profile/${paramsId}`);
  }
};

// Delete Profile Controller
module.exports.deleteProfile = async (req, res) => {
  const paramsId = req.params.id; // The user ID from the URL
  const userId = req.user._id; // The currently logged-in user's ID

  try {
    // Fetch the mentor profile based on the user ID
    const mentor = await mentorService.getMentorByUserId(paramsId);

    // Check if the mentor exists and if the logged-in user is the owner
    if (!mentor || mentor.user._id.toString() !== userId.toString()) {
      req.flash("error", "You do not have permission to delete this profile.");
      return res.redirect(`/mentor/profile/${paramsId}`);
    }

    // Delete the mentor profile
    await mentorService.deleteMentor(mentor._id);

    // Delete the associated user account
    await userService.deleteUserById(userId); // Ensure you have a `deleteUserById` function in your user service

    // Logout the user after deletion
    req.logout((err) => {
      if (err) {
        console.error("Error during logout after profile deletion: ", err);
        req.flash(
          "error",
          "An error occurred during logout. Please try again."
        );
        return res.redirect(`/mentor/profile/${paramsId}`);
      }

      req.flash("success", "Your profile has been deleted successfully.");
      res.redirect("/"); // Redirect to the homepage or another safe page
    });
  } catch (error) {
    console.error("Error deleting mentor profile and user: ", error);
    req.flash("error", "An error occurred while deleting the profile.");
    res.redirect(`/mentor/profile/${paramsId}`);
  }
};

module.exports.displayAllConnections = async (req, res) => {
  try {
    // Find the mentor using the logged-in user's ID
    const mentor = await Mentor.findOne({ user: req.user._id }).populate({
      path: "connections",
      populate: { path: "user" }, // Populate mentor details along with their user details
    });

    if (!mentor) {
      return res.status(404).send("mentor profile not found");
    }

    // Send the list of connected mentors to the EJS view
    res.render("mentor/connection/index", {
      mentorId: mentor._id,
      loggedInUserId: req.user._id,
      connectedMentees: mentor.connections, // Array of connected mentors
      cssFile: "mentor/connection/index.css",
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.pendingRequest = async (req, res) => {
  try {
    // Find the mentor using the logged-in user's ID
    const mentor = await Mentor.findOne({ user: req.user._id }).populate({
      path: "pendingRequests",
      populate: {
        path: "mentee",
        populate: { path: "user" }, // Populate mentee details along with their user details
      },
    });

    if (!mentor) {
      return res.status(404).send("Mentor profile not found");
    }

    // Send the list of pending connection requests to the EJS view
    res.render("mentor/connection/pendingRequest", {
      pendingRequests: mentor.pendingRequests, // Array of pending requests
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.acceptRequest = async (req, res) => {
  const { reason } = req.body;
  const requestId = req.params.requestId;

  try {
    const connectionRequest = await ConnectionRequest.findById(requestId);
    if (!connectionRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Connection request not found." });
    }

    if (connectionRequest.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Request is no longer pending." });
    }

    // Update connection request status
    connectionRequest.status = "accepted";
    connectionRequest.reason = reason || "Request accepted.";
    await connectionRequest.save();

    // Update mentor and mentee connections
    const mentor = await Mentor.findById(connectionRequest.mentor);
    const mentee = await Mentee.findById(connectionRequest.mentee);

    if (!mentor || !mentee) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor or Mentee not found." });
    }

    // Add to connections and remove from pendingRequests
    if (!mentor.connections.includes(mentee._id)) {
      mentor.connections.push(mentee._id);
    }
    mentor.pendingRequests = mentor.pendingRequests.filter(
      (reqId) => reqId.toString() !== requestId
    );

    if (!mentee.connections.includes(mentor._id)) {
      mentee.connections.push(mentor._id);
    }
    mentee.pendingRequests = mentee.pendingRequests.filter(
      (reqId) => reqId.toString() !== requestId
    );

    await mentor.save();
    await mentee.save();

    res.json({ success: true, message: "Connection request accepted." });
  } catch (error) {
    console.error("Error accepting connection request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while accepting the request.",
    });
  }
};

module.exports.rejectRequest = async (req, res) => {
  const { reason } = req.body;
  const requestId = req.params.requestId;

  try {
    const connectionRequest = await ConnectionRequest.findById(requestId);
    if (!connectionRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Connection request not found." });
    }

    if (connectionRequest.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Request is no longer pending." });
    }

    connectionRequest.status = "rejected";
    connectionRequest.reason = reason || "Request rejected.";
    await connectionRequest.save();

    res.json({ success: true, message: "Connection request rejected." });
  } catch (error) {
    console.error("Error rejecting connection request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while rejecting the request.",
    });
  }
};

module.exports.renderMessagePage = async (req, res) => {
  try {
    const connectionRequest = await ConnectionRequest.findById(
      req.params.requestId
    );
    if (!connectionRequest) {
      return res.status(404).send("Connection request not found");
    }
    res.render("mentor/connection/message", { message });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering message page");
  }
};

module.exports.renderMentorCalendar = async (req, res) => {
  try {
    // Fetch the logged-in user's mentor ID
    const mentorId = req.user._id;

    // Fetch all bookings where the logged-in user is the mentor
    const bookings = await Booking.find({ mentorUserId: mentorId })
      .populate("menteeUserId") // Populate mentee details
      .exec();

    // console.log(
    //   "................................................................"
    // );

    // Format bookings for FullCalendar
    const formattedBookings = bookings.map((booking) => ({
      bookingId: booking._id.toString(), // Add the booking ID to the formatted data
      title: `Session with ${
        booking.menteeUserId ? booking.menteeUserId.username : "Mentee"
      }`, // Use mentee's username
      start: booking.schedule.start.toISOString(), // Convert date to ISO string
      end: booking.schedule.end.toISOString(), // Convert date to ISO string
      status: booking.status, // Include booking status
      reason: booking.reason || "", // Default to empty string if no reason
      paymentStatus: booking.payment
        ? `Payment done with ${booking.payment.toString()}`
        : "Payment not done", // Check for payment and format accordingly
    }));

    // console.log(formattedBookings);
    // Render the schedule page and pass the bookings data
    res.render("mentor/booking/index.ejs", {
      userRole: "mentor", // Render the page for a mentor
      bookings: formattedBookings, // Pass formatted bookings to the template
    });
  } catch (err) {
    console.error("Error fetching mentor schedule:", err);
    res.status(500).send("An error occurred while fetching your schedule.");
  }
};

module.exports.updateBooking = async (req, res) => {
  console.log("Updating schedule: Received request body:");
  console.log(req.body);

  const { bookingId, status, reason } = req.body; // Extract bookingId, status, and reason

  // Step 1: Validate input
  if (!bookingId || !status) {
    console.error("Error: Missing required fields in the request body.");
    return res.status(400).send({
      message: "Invalid request: bookingId and status are required fields.",
    });
  }

  try {
    // Step 2: Convert bookingId to ObjectId if it's a string and the field in DB is an ObjectId
    let bookingQuery = { bookingId };
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      bookingQuery = { _id: new mongoose.Types.ObjectId(bookingId) }; // Correct instantiation of ObjectId
    }

    console.log(`Searching for booking with bookingId: ${bookingId}`);
    const booking = await Booking.findOne(bookingQuery); // Use the correct query format
    console.log("Booking query executed.");

    if (booking) {
      console.log(`Booking found. Updating bookingId: ${bookingId}`);

      // Step 3: Update booking fields
      booking.status = status;
      booking.reason = reason;

      console.log(`Saving updated booking with bookingId: ${bookingId}`);
      await booking.save(); // Save changes to the database
      console.log("Booking saved successfully.");

      // Step 4: Send success response
      return res.status(200).send({ message: "Booking updated successfully" });
    } else {
      console.error(`Error: Booking with bookingId ${bookingId} not found.`);
      return res.status(404).send({
        message: `Booking not found: No booking exists with bookingId ${bookingId}`,
      });
    }
  } catch (error) {
    // Step 5: Handle errors
    console.error("Error during booking update:", error);
    return res.status(500).send({
      message: "Internal server error. Please try again later.",
    });
  }
};
