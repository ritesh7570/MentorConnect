// routes/mentorRoutes.js

const express = require("express");
const { isLoggedIn, isMentor, isOwner } = require("../middlewares/authMiddleware");
const { dashboard, 
    viewProfile, editProfile, deleteProfile, renderEditProfile,
    displayAllConnections,pendingRequest, acceptRequest, rejectRequest,
    renderMessagePage,renderMentorOwnSchdule,updateMentorOwnSchdule,renderMentorCalendar,updateBooking
    
} = require("../controllers/mentorWebController");

const router = express.Router();

// schedule
router.get("/schedule",isLoggedIn,isMentor,renderMentorOwnSchdule);
router.post("/update-booking",isLoggedIn,isMentor,updateMentorOwnSchdule);


// Mentor Dashboard
router.get("/", isLoggedIn, isMentor, dashboard);

// Manage Users (mentor-specific user management)
// router.get("/users", isLoggedIn, isMentor, viewUsers);

// View Mentor Profile
router.get("/profile/:id", isLoggedIn,  viewProfile);

// Edit Mentor Profile (only for the owner)
router.get("/profile/edit/:id", isLoggedIn, isMentor, isOwner, renderEditProfile);
router.post("/profile/edit/:id", isLoggedIn, isMentor, isOwner, editProfile);

// Delete Mentor Profile (only for the owner)
router.post("/profile/delete/:id", isLoggedIn, isMentor, isOwner, deleteProfile);

// Mentor Notifications
// router.get("/notifications", isLoggedIn, isMentor, notifications);



router.get("/connection", isLoggedIn, isMentor, displayAllConnections);
router.get("/connection/:mentorId/pendingRequest", isLoggedIn, isMentor, pendingRequest);

// Accept Connection Request
router.post("/connection/accept/:requestId",isLoggedIn,isMentor, acceptRequest);

// Reject Connection Request
router.post("/connection/reject/:requestId", isLoggedIn, isMentor, rejectRequest);
 
// render message page with respective mentee
router.get("/message/:menteeId", isLoggedIn, isMentor, renderMessagePage);

// booking
router.get("/schedule", isLoggedIn, isMentor, renderMentorCalendar);
router.post("/update-booking", isLoggedIn, isMentor, updateBooking);

module.exports = router;

