const express = require("express");
const { isLoggedIn, isMentee, isOwner } = require("../middlewares/authMiddleware");
const menteeController = require("../controllers/menteeWebController");

const router = express.Router();


// schedule
router.get("/schedule/:mentorUserId",isLoggedIn,isMentee,menteeController.renderParticularMentorScheduleForMentee);
// router.post("/update-booking",isLoggedIn,isMentee,updateMentorOwnSchdule);



// Dashboard route
router.get("/", isLoggedIn, isMentee, menteeController.dashboard);

// Profile routes
router.get("/profile/:id", isLoggedIn, isMentee, menteeController.viewProfile);
router.get("/profile/edit/:id", isLoggedIn, isMentee, isOwner, menteeController.renderEditProfile);
router.post("/profile/edit/:id", isLoggedIn, isMentee, isOwner, menteeController.editProfile);
router.post("/profile/delete/:id", isLoggedIn, isMentee, isOwner, menteeController.deleteProfile);

// Mentor listing and finding routes
router.get("/mentorList", isLoggedIn, isMentee, menteeController.displayMentorList);

// Connection routes
router.get("/connections", isLoggedIn, isMentee, menteeController.displayAllConnections);
router.post("/connections/:mentorId/connectRequest", isLoggedIn, isMentee, menteeController.connectRequest);
router.get("/connections/:mentorId/disconnect", isLoggedIn, isMentee, menteeController.disconnect);
router.delete("/connections/:mentorId/cancelRequest", isLoggedIn, isMentee, menteeController.cancelRequest);

// scheduling
router.get("/schedule/:mentorUserId", isLoggedIn, isMentee, menteeController.renderParticularMentorScheduleForMentee);
router.post(
  "/schedule/book-slot",
  isLoggedIn,
  isMentee,
  menteeController.handleBookSlot
);
module.exports = router;
