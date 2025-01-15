const Admin = require("../models/admin/admin");
const adminService = require("../services/adminService");
const userService = require("../services/userService");
const { validationResult } = require("express-validator");

const Mentor = require("../models/mentor/mentor");
const User = require("../models/user");

// Admin Home
module.exports.adminHome = async (req, res) => {
  try {
    const pendingMentors = await Mentor.find({ registrationStatus: "pending" })
      .populate({
        path: "user",
        select: "username email",
        match: { _id: { $ne: null } }, // Exclude null references
      })
      .select("expertise yearsOfExperience bio experienceCertificate")
      .lean(); // Converts Mongoose documents to plain JavaScript objects

    const filteredPendingMentors = pendingMentors.filter(
      (mentor) => mentor.user
    );

    const reportedMentors = await User.find({
      "reportedBy.0": { $exists: true },
      role: "mentor",
    })
      .populate("reportedBy", "username email")
      .select("username email reportedBy isBlacklisted");
    console.log("pending menttor: ", pendingMentors);
    console.log("Reported Mentors: ", reportedMentors);

    res.render("admin/home/adminHome", {
      pendingMentors: filteredPendingMentors,
      reportedMentors,
      cssFile:"admin/mentorReported.css"
    });
  } catch (error) {
    req.flash("error", "Error loading admin data.");
    res.redirect("/");
  }
};

// Approve or Reject Mentor
module.exports.updateMentorStatus = async (req, res) => {
  try {
    const { mentorId, action } = req.body; // action = 'approve' or 'reject'
    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      req.flash("error", "Mentor not found.");
      return res.redirect("/admin");
    }

    if (action === "approve") {
      mentor.registrationStatus = "approved";
      await mentor.save();
      req.flash("success", "Mentor approved successfully.");
    } else if (action === "reject") {
      await mentor.deleteOne(); // Reject and remove mentor
      req.flash("success", "Mentor rejected and removed.");
    }

    res.redirect("/admin");
  } catch (error) {
    req.flash("error", "Error updating mentor status.");
    res.redirect("/admin");
  }
};




// Blacklist or Reset Reports for Mentor
module.exports.manageReportedMentor = async (req, res) => {
  try {
    const { mentorId, action } = req.body; // action = 'blacklist' or 'resetReports'
    const mentor = await User.findById(mentorId);

    if (!mentor || mentor.role !== "mentor") {
      req.flash("error", "Mentor not found.");
      return res.redirect("/admin");
    }

    if (action === "blacklist") {
      mentor.isBlacklisted = true;
      await mentor.save();
      req.flash("success", "Mentor has been blacklisted.");
    } else if (action === "resetReports") {
      mentor.reportedBy = [];
      await mentor.save();
      req.flash("success", "Mentor reports have been reset.");
    }

    res.redirect("/admin");
  } catch (error) {
    req.flash("error", "Error managing reported mentor.");
    res.redirect("/admin");
  }
};




module.exports.dashboard = (req, res) => {
  res.render("admin/home/home", { cssFile: "admin/home.css" });
};

module.exports.viewUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(); // Adjust service as needed to fetch users
    res.render("admin/users/users", { users });
  } catch (error) {
    console.error("Error fetching users: ", error);
    req.flash("error", "An error occurred while fetching users.");
    res.redirect("/");
  }
};

module.exports.viewProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const admin = await adminService.getAdminByUserId(userId);

    if (!admin) {
      req.flash("error", "Admin not found.");
      return res.redirect("/");
    }

    const isOwner = admin.user._id.toString() === req.user._id.toString();

    res.render("admin/profile/index", { admin, isOwner });
  } catch (error) {
    console.error("Error fetching admin profile: ", error);
    req.flash("error", "An error occurred while fetching the profile.");
    res.redirect("/");
  }
};

module.exports.renderEditProfile = async (req, res) => {
  const userId = req.user._id;
  const admin = await adminService.getAdminByUserId(userId);
  res.render("admin/profile/edit", { admin });
};

module.exports.editProfile = async (req, res) => {
  const paramsId = req.params.id;
  const userId = req.user._id;

  try {
    const admin = await adminService.getAdminByUserId(userId);

    if (!admin || admin.user._id.toString() !== userId.toString()) {
      req.flash("error", "You do not have permission to edit this profile.");
      return res.redirect(`/admin/profile/${paramsId}`);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("admin/profile/edit", { admin, errors: errors.array() });
    }

    const updatedData = {
      permissions: req.body.permissions,
      department: req.body.department,
    };

    await adminService.updateAdmin(admin._id, updatedData);
    req.flash("success", "Profile updated successfully!");
    res.redirect(`/admin/profile/${paramsId}`);
  } catch (error) {
    console.error("Error updating admin profile: ", error);
    req.flash("error", "An error occurred while updating the profile.");
    res.redirect(`/admin/profile/${paramsId}`);
  }
};

module.exports.deleteProfile = async (req, res) => {
  const paramsId = req.params.id;
  const userId = req.user._id;

  try {
    const admin = await adminService.getAdminByUserId(paramsId);

    if (!admin || admin.user._id.toString() !== userId.toString()) {
      req.flash("error", "You do not have permission to delete this profile.");
      return res.redirect(`/admin/profile/${paramsId}`);
    }

    await adminService.deleteAdmin(admin._id);
    await userService.deleteUserById(userId);

    req.logout((err) => {
      if (err) {
        req.flash("error", "An error occurred during logout. Please try again.");
        return res.redirect(`/admin/profile/${paramsId}`);
      }
      req.flash("success", "Your profile has been deleted successfully.");
      res.redirect("/");
    });
  } catch (error) {
    console.error("Error deleting admin profile and user: ", error);
    req.flash("error", "An error occurred while deleting the profile.");
    res.redirect(`/admin/profile/${paramsId}`);
  }
};



// View All Users
module.exports.viewUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(); // Fetch all users
    res.render("admin/users/users", { users });  // Render the users page
  } catch (error) {
    console.error("Error fetching users: ", error);
    req.flash("error", "An error occurred while fetching users.");
    res.redirect("/");
  }
};

// Delete User and Related Role Documents
module.exports.deleteUser = async (req, res) => {
  const userId = req.params.id;  // Get user ID from URL

  try {
    const user = await User.findById(userId);

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/admin/users");
    }

    // Delete role-specific documents (e.g., Mentor or Mentee)
    if (user.role === 'mentor') {
      const mentor = await Mentor.findOne({ user: userId });
      if (mentor) {
        await mentor.deleteOne(); // Delete mentor document
      }
    }
    // Handle other roles (like Mentee) if necessary
    // if (user.role === 'mentee') {
    //   const mentee = await Mentee.findOne({ user: userId });
    //   if (mentee) {
    //     await mentee.deleteOne(); // Delete mentee document
    //   }
    // }

    // Delete the user
    await user.deleteOne();

    req.flash("success", "User and related documents deleted successfully.");
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Error deleting user: ", error);
    req.flash("error", "An error occurred while deleting the user.");
    res.redirect("/admin/users");
  }
};
