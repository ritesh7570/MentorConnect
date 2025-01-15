const { ConnectionRequest } = require("../models/connectionRequest");
const { Mentor } = require("../models/Mentor");
const { Mentee } = require("../models/Mentee");

/*
*
 * Sends a connection request from a mentee to a mentor.
 * @param {ObjectId} menteeId - The ID of the mentee.
 * @param {ObjectId} mentorId - The ID of the mentor.
 * @returns {Object} - The created connection request.
 */
exports.sendConnectionRequest = async (menteeId, mentorId) => {
  const mentor = await Mentor.findById(mentorId);
  const mentee = await Mentee.findById(menteeId);

  if (!mentor) throw new Error("Mentor not found.");
  if (!mentee) throw new Error("Mentee not found.");

  const existingRequest = await ConnectionRequest.findOne({
    mentee: menteeId,
    mentor: mentorId,
    status: "pending",
  });

  if (existingRequest) throw new Error("A pending request already exists.");

  const connectionRequest = new ConnectionRequest({ mentee: menteeId, mentor: mentorId });
  await connectionRequest.save();

  mentor.pendingRequests.push(connectionRequest._id);
  mentee.pendingRequests.push(connectionRequest._id);

  await mentor.save();
  await mentee.save();

  return connectionRequest;
};

/*
*
 * Gets all pending connection requests for a mentor.
 * @param {ObjectId} mentorId - The ID of the mentor.
 * @returns {Array} - The list of pending requests.
 */
exports.getPendingRequestsForMentor = async (mentorId) => {
  const mentor = await Mentor.findById(mentorId).populate("pendingRequests");
  if (!mentor) throw new Error("Mentor not found.");
  return mentor.pendingRequests;
};

/*
*
 * Gets all sent connection requests for a mentee.
 * @param {ObjectId} menteeId - The ID of the mentee.
 * @returns {Array} - The list of sent requests.
 */
exports.getSentRequestsForMentee = async (menteeId) => {
  const mentee = await Mentee.findById(menteeId).populate("pendingRequests");
  if (!mentee) throw new Error("Mentee not found.");
  return mentee.pendingRequests;
};

/*
*
 * Responds to a connection request.
 * @param {ObjectId} requestId - The ID of the connection request.
 * @param {string} status - The response status ("accepted" or "rejected").
 * @param {string} [reason] - The optional reason for rejection.
 * @returns {Object} - The updated connection request.
 */
exports.respondToRequest = async (requestId, status, reason) => {
  const connectionRequest = await ConnectionRequest.findById(requestId);
  if (!connectionRequest) throw new Error("Connection request not found.");

  if (connectionRequest.status !== "pending")
    throw new Error("Request is no longer pending.");

  connectionRequest.status = status;
  if (reason) connectionRequest.reason = reason;

  await connectionRequest.save();

  if (status === "accepted") {
    const mentor = await Mentor.findById(connectionRequest.mentor);
    const mentee = await Mentee.findById(connectionRequest.mentee);

    mentor.connections.push(connectionRequest.mentee);
    mentee.connections.push(connectionRequest.mentor);

    await mentor.save();
    await mentee.save();
  }

  return connectionRequest;
};

/*
*
 * Gets all established connections for a user.
 * @param {ObjectId} userId - The ID of the user.
 * @param {string} role - The role of the user ("mentor" or "mentee").
 * @returns {Array} - The list of established connections.
 */
exports.getConnections = async (userId, role) => {
  if (role === "mentor") {
    const mentor = await Mentor.findOne({ user: userId }).populate("connections");
    if (!mentor) throw new Error("Mentor not found.");
    return mentor.connections;
  } else if (role === "mentee") {
    const mentee = await Mentee.findOne({ user: userId }).populate("connections");
    if (!mentee) throw new Error("Mentee not found.");
    return mentee.connections;
  } else {
    throw new Error("Invalid role.");
  }
};
