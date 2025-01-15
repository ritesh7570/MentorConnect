const express = require("express");
const { isLoggedIn, isAdmin, isOwner } = require("../middlewares/authMiddleware");
const {
  dashboard,
  viewUsers,
  viewProfile,
  editProfile,
  deleteProfile,
  renderEditProfile,
} = require("../controllers/adminWebController");

const router = express.Router();

// Admin Dashboard
router.get("/", isLoggedIn, isAdmin, dashboard);

// View Users (admin-specific user management)
router.get("/users", isLoggedIn, isAdmin, viewUsers);

// View Admin Profile
router.get("/profile/:id", isLoggedIn, isAdmin, viewProfile);

// Edit Admin Profile (only for the owner)
router.get("/profile/edit/:id", isLoggedIn, isAdmin, isOwner, renderEditProfile);
router.post("/profile/edit/:id", isLoggedIn, isAdmin, isOwner, editProfile);

// Delete Admin Profile (only for the owner)
router.post("/profile/delete/:id", isLoggedIn, isAdmin, isOwner, deleteProfile);

module.exports = router;
