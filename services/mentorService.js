const Mentor = require("../models/mentor/mentor");

/*
  Get all mentors
  @returns {Promise<Array>} List of mentors
 */
const getAllMentors = async () => {
  return await Mentor.find({});
};

/*
*
 * Get mentor by ID
 * @param {String} mentorId - Mentor's ID
 * @returns {Promise<Object>} Mentor document
 */
const getMentorByUserId = async (userId) => {
  return await Mentor.findOne({ user: userId })
    .populate('user')  // Populate the user field with the corresponding User document
    .exec();
};

const getMentorByMentor = async (mentorId) => {
  return await Mentor.findOne({ mentorId }) .exec();
};

/*
*
 * Check immediate availability of mentors
 * @returns {Promise<Array>} List of available mentors
 */
const checkImmediateAvailability = async () => {
  return await Mentor.find({
    "availability.type": "immediate",
    "availability.endTime": { $exists: false },
  });
};

/*
*
 * Set mentor's immediate availability
 * @param {String} mentorId - Mentor's ID
 * @returns {Promise<Object>} Updated mentor document
 */
const setImmediateAvailability = async (mentorId) => {
  return await Mentor.findByIdAndUpdate(mentorId, {
    availability: {
      type: "immediate",
      startTime: new Date(),
    },
  }, { new: true });
};

/*
*
 * Schedule mentor availability
 * @param {String} mentorId - Mentor's ID
 * @param {Date} startTime - Start time
 * @param {Date|null} [endTime] - End time (optional)
 * @returns {Promise<Object>} Updated mentor document
 */
const scheduleAvailability = async (mentorId, startTime, endTime = null) => {
  return await Mentor.findByIdAndUpdate(mentorId, {
    availability: {
      type: "scheduled",
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
    },
  }, { new: true });
};

/*
*
 * Mark mentor as unavailable with a reason
 * @param {String} mentorId - Mentor's ID
 * @param {String} reason - Reason for unavailability
 * @returns {Promise<Object>} Updated mentor document
 */
const markUnavailable = async (mentorId, reason) => {
  return await Mentor.findByIdAndUpdate(mentorId, {
    availability: {
      type: "immediate",
      startTime: new Date(),
      reasonUnavailable: reason,
    },
  }, { new: true });
};

/*
*
 * Add a new mentor
 * @param {Object} mentorData - Data for the new mentor
 * @returns {Promise<Object>} Created mentor document
 */
const addMentor = async (mentorData) => {
  const mentor = new Mentor(mentorData);
  return await mentor.save();
};

/*
*
 * Update mentor details
 * @param {String} mentorId - Mentor's ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated mentor document
 */
const updateMentor = async (mentorId, updateData) => {
  return await Mentor.findByIdAndUpdate(mentorId, updateData, { new: true });
};

/*
*
 * Delete mentor
 * @param {String} mentorId - Mentor's ID
 * @returns {Promise<Object>} Deleted mentor document
 */
const deleteMentor = async (mentorId) => {
  return await Mentor.findByIdAndDelete(mentorId);
};

// Export all functions
module.exports = {
  getAllMentors,
  getMentorByUserId,
  checkImmediateAvailability,
  setImmediateAvailability,
  scheduleAvailability,
  markUnavailable,
  addMentor,
  updateMentor,
  deleteMentor,
  getMentorByMentor,
};
