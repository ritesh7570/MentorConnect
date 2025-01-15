const Chat = require("../models/chat");

module.exports.getChatWithParticipants = async (userId1, userId2, loggedInUser) => {
  try {
    // Fetch the chat room based on participants
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] },
    })
      .populate("participants", "username role")
      .populate("messages.sender", "username");

    if (!chat) {
      // Create a new chat room if one doesn't exist
      chat = new Chat({
        participants: [userId1, userId2],
      });
      await chat.save();
    }

    // Ensure participants are correctly populated
    const secondPersonId =
      userId1 === loggedInUser._id.toString() ? userId2 : userId1;

    const secondPerson = chat.participants.find(
      (participant) => participant._id.toString() === secondPersonId
    );

    if (!secondPerson) {
      throw new Error("The other user in the chat could not be found.");
    }

    // Prepare chat messages with serialized timestamps
    const chatMessages = chat.messages.map((msg) => ({
      ...msg.toObject(),
      sender: {
        _id: msg.sender._id.toString(),
        username: msg.sender.username,
      },
      timestamp: msg.timestamp.toISOString(), // Convert timestamp to ISO format
    }));

    return {
      chat: {
        ...chat.toObject(),
        messages: chatMessages,
      },
      secondPerson: {
        id: secondPerson._id.toString(),
        name: secondPerson.username,
        role: secondPerson.role,
      },
    };
  } catch (error) {
    console.error("Error in chatService:", error);
    throw error;
  }
};
