const Mentee = require("../models/mentee/mentee");
const ConnectionRequest = require("../models/connectionRequest");
const Mentor = require("../models/mentor/mentor");
const userService = require("./userService");

const getMenteeByUserId = async (userId) => {
  return Mentee.findOne({ user: userId }).populate("user").exec();
};

const getMenteeProfile = async (userId, loggedInUserId) => {
  const mentee = await getMenteeByUserId(userId);
  const isOwner = mentee?.user?._id.toString() === loggedInUserId.toString();
  return { mentee, isOwner };
};

const updateMenteeProfile = async (userId, paramsId, updateData) => {
  const mentee = await getMenteeByUserId(userId);

  if (!mentee || mentee.user._id.toString() !== userId.toString()) {
    return { success: false, message: "You do not have permission to edit this profile." };
  }

  await Mentee.findByIdAndUpdate(mentee._id, updateData, { new: true });
  return { success: true, message: "Profile updated successfully!" };
};

const deleteMenteeProfile = async (userId, paramsId, logoutCallback) => {
  const mentee = await getMenteeByUserId(paramsId);

  if (!mentee || mentee.user._id.toString() !== userId.toString()) {
    return { success: false, message: "You do not have permission to delete this profile." };
  }

  await Mentee.findByIdAndDelete(mentee._id);
  await userService.deleteUserById(userId);

  return new Promise((resolve) => {
    logoutCallback((err) => {
      if (err) {
        resolve({ success: false, message: "An error occurred during logout. Please try again." });
      } else {
        resolve({ success: true, message: "Your profile has been deleted successfully." });
      }
    });
  });
};

const getMentorList = async (menteeUserId) => {
  const mentee = await getMenteeByUserId(menteeUserId);
  const mentors = await Mentor.find().populate("user").exec();

  for (const mentor of mentors) {
    const connectionRequest = await ConnectionRequest.findOne({
      mentee: mentee._id,
      mentor: mentor._id,
    });

    if (mentee.connections.includes(mentor._id)) {
      mentor.connectionStatus = "connected";
    } else if (connectionRequest) {
      mentor.connectionStatus = connectionRequest.status;
    } else {
      mentor.connectionStatus = "none";
    }
  }

  return mentors;
};

const getMenteeConnections = async (userId) => {
  const mentee = await getMenteeByUserId(userId);
  return mentee.connections || [];
};

module.exports = {
  getMenteeByUserId,
  getMenteeProfile,
  updateMenteeProfile,
  deleteMenteeProfile,
  getMentorList,
  getMenteeConnections,
};
