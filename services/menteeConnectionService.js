const ConnectionRequest = require("../models/connectionRequest"); // Ensure you're importing the model properly
const Mentee = require("../models/mentee/mentee");
const Mentor = require("../models/mentor/mentor");

class MenteeConnectionService {
  static async sendConnectionRequest(menteeId, mentorId) {
    try {
      // Ensure mentor exists
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) {
        return { success: false, message: "Mentor not found." };
      }

      // Fetch the mentee record
      const mentee = await Mentee.findOne({ user: menteeId });
      if (!mentee) {
        return { success: false, message: "Mentee profile not found." };
      }

      // Check if the mentee is already connected or has sent a request
      const existingRequest = await ConnectionRequest.findOne({
        mentee: mentee._id,
        mentor: mentor._id,
      });

      const alreadyConnected = mentee.connections.includes(mentor._id);
      if (existingRequest) {
        return { success: false, message: "Connection request already sent." };
      }

      if (alreadyConnected) {
        return {
          success: false,
          message: "You are already connected with this mentor.",
        };
      }

      // Create a new connection request
      const connectionRequest = new ConnectionRequest({
        mentee: mentee._id,
        mentor: mentor._id,
        status: "pending",
      });

      await connectionRequest.save();

      // Add the request to mentee's pendingRequests
      mentee.pendingRequests.push(connectionRequest._id);
      await mentee.save();

      // Add the request to mentor's pendingRequests
      mentor.pendingRequests.push(connectionRequest._id);
      await mentor.save();

      return {
        success: true,
        message: "Connection request sent successfully.",
      };
    } catch (error) {
      console.error("Error in sendConnectionRequest:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  }
}

module.exports = MenteeConnectionService;
