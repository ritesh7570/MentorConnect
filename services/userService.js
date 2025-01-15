const User = require("../models/user");
const Admin = require("../models/admin/admin");
const Mentor = require("../models/mentor/mentor");
const Mentee = require("../models/mentee/mentee");

/*
*
 * Register a user and create a role-specific document.
 */
exports.register = async ({ username, password, email, role }) => {
  try {
    // Create a new User document
    const user = new User({ username, email, role });
    const registeredUser = await User.register(user, password);

    // Create role-specific document
    let roleDocument;
    switch (role) {
      case "admin":
        roleDocument = new Admin({ user: registeredUser._id });
        break;

      case "mentor":
        roleDocument = new Mentor({ user: registeredUser._id });
        break;

      case "mentee":
        roleDocument = new Mentee({ user: registeredUser._id });
        break;

      default:
        throw new Error("Invalid role specified");
    }

    if (roleDocument) await roleDocument.save();
    return { user: registeredUser, roleDocument };
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

/**
 * Update user email and username.
 */
exports.updateUser = async (userId, updateData) => {
  const allowedFields = ["email", "username"]; // Only allow updating email and username
  const updatePayload = {};

  allowedFields.forEach((field) => {
    if (updateData[field]) updatePayload[field] = updateData[field];
  });

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatePayload, { new: true });
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  } catch (error) {
    throw new Error(`Update failed: ${error.message}`);
  }
};

/**
 * Delete a user and their associated role-specific document.
 */
exports.deleteUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Delete role-specific document
    switch (user.role) {
      case "admin":
        await Admin.findOneAndDelete({ user: userId });
        break;
      case "mentor":
        await Mentor.findOneAndDelete({ user: userId });
        break;
      case "mentee":
        await Mentee.findOneAndDelete({ user: userId });
        break;
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    return { success: true, message: "User and associated documents deleted successfully" };
  } catch (error) {
    throw new Error(`Deletion failed: ${error.message}`);
  }
};

/**
 * Block a user.
 */
exports.blockUser = async (userId, blockId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.blockedUsers.includes(blockId)) {
      user.blockedUsers.push(blockId);
      await user.save();
    }
    return { success: true, message: "User blocked successfully" };
  } catch (error) {
    throw new Error(`Block operation failed: ${error.message}`);
  }
};

/**
 * Unblock a user.
 */
exports.unblockUser = async (userId, blockId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== blockId);
    await user.save();
    return { success: true, message: "User unblocked successfully" };
  } catch (error) {
    throw new Error(`Unblock operation failed: ${error.message}`);
  }
};


exports.resetPassword = async (username, newPassword) => {
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
  
      // Reset password using Passport-Local-Mongoose method
      await user.setPassword(newPassword);
      await user.save();
  
      return { success: true, message: "Password reset successfully" };
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  };