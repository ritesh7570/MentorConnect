
const express = require("express");
const { isLoggedIn, isMentor, isOwner } = require("../middlewares/authMiddleware");
const router = express.Router();
const chatController = require("../controllers/chatController");


// Get or create a chat
router.get("/:userId1/:userId2", chatController.renderChatPage);
/*
// Send a message
router.post("/:chatId/send", chatController.sendMessage);

// Fetch messages
router.get("/:chatId/messages", chatController.getMessages);

*/
module.exports = router;