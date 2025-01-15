const Chat = require("../models/chat");
const User = require("../models/user");
const chatService = require("../services/chatService");

module.exports.renderChatPage = async (req, res) => {
  const { userId1, userId2 } = req.params;
  const loggedInUser = req.user;

  try {
    const chatData = await chatService.getChatWithParticipants(
      userId1,
      userId2,
      loggedInUser
    );

    const { chat, chatMessages, secondPerson } = chatData;

    // Render the appropriate view based on the user's role
    res.render(
      loggedInUser.role === "mentor" ? "mentor/chat/chat" : "mentee/chat/chat",
      {
        chat,
        loggedInUser: {
          id: loggedInUser._id.toString(),
          name: loggedInUser.username,
          role: loggedInUser.role,
        },
        secondPerson,
        cssFile: "chat3.css",
      }
    );
  } catch (error) {
    console.error("Error rendering chat page:", error);
    res.status(500).send("An error occurred.");
  }
};
