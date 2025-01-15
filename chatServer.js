// chatServer.js
const Chat = require("./models/chat"); // Import Chat model

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a chat room based on the chat ID
    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
      console.log(`User joined room: ${chatId}`);
    });

    // Import the Booking model
    const Booking = require("./models/bookingModel");

    // Listen for a new message from the client
    socket.on("newMessage", async ({ chatId, senderId, text }) => {
      try {
        // Find the chat
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        // Find the other participant in the chat
        const otherParticipantId = chat.participants.find(
          (participant) => participant.toString() !== senderId
        );

        // Ensure the sender is allowed to message (confirmed and active booking)
        const now = new Date();
        const booking1 = await Booking.findOne({
          menteeUserId: senderId, // Assuming sender is always the mentee
          mentorUserId: otherParticipantId, // Assuming the other user is the mentor
          status: "confirmed",
          "schedule.start": { $lte: now },
          "schedule.end": { $gte: now },
        });

        if (!booking1) {
          const booking2 = await Booking.findOne({
            mentorUserId: senderId, // Assuming sender is always the mentee
            menteeUserId: otherParticipantId, // Assuming the other user is the mentor
            status: "confirmed",
            "schedule.start": { $lte: now },
            "schedule.end": { $gte: now },
          });
          if (!booking2) {
            console.error("Unauthorized message attempt by:", senderId);
            return;
          }
        }

        // Save the message to the database
        const message = { sender: senderId, text, timestamp: new Date() };
        chat.messages.push(message);
        await chat.save();

        // Broadcast the new message to all users in the room
        io.to(chatId).emit("message", message);
      } catch (error) {
        console.error("Error handling newMessage:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
