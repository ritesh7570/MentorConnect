const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Block User Route (Common for both Mentor and Mentee)
router.post("/block/:userId/:blockUserId", async (req, res) => {
  try {
    const { userId, blockUserId } = req.params;

    // Fetch the users from the database
    const user = await User.findById(userId);
    const blockUser = await User.findById(blockUserId);

    // Check if both users exist
    if (!user || !blockUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent blocking if either user is an admin
    if (blockUser.role === "admin") {
      return res.status(400).json({ message: "Admins cannot be blocked." });
    }

    // Prevent self-blocking
    if (userId === blockUserId) {
      return res.status(400).json({ message: "You cannot block yourself." });
    }

    // Check if the user is already blocking the target user
    if (user.blockedUsers.includes(blockUserId)) {
      return res.status(400).json({ message: "User already blocked." });
    }

    // Add the blocked user to the current user's blockedUsers array
    user.blockedUsers.push(blockUserId);
    await user.save();

    // Send a success response
    res.status(200).json({ message: "User blocked successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to block user." });
  }
});

module.exports = router;
