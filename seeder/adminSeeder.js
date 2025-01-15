const mongoose = require("mongoose");
const User = require("../models/user");
const Admin = require("../models/admin/admin");

const admins = [
  {
    username: "admin",
    password: "admin",
    role: "admin",
    permissions: ["read", "write", "delete"],
    department: "Operations",
  },
  {
    username: "admin_mary",
    password: "marySecure123",
    role: "admin",
    permissions: ["read", "write", "delete"],
    department: "Human Resources",
  },
];

const seedAdmins = async () => {
  try {
    await User.deleteMany({ role: "admin" }); // Clear existing admin users
    await Admin.deleteMany(); // Clear existing admin records
    console.log("Existing admins removed.");

    for (const adminData of admins) {
      // Create a new User
      const user = new User({
        username: adminData.username,
        role: adminData.role,
      });

      await user.setPassword(adminData.password); // Hash and set password
      await user.save();
      console.log(`User ${adminData.username} created.`);

      // Create a new Admin referencing the User
      const admin = new Admin({
        user: user._id,
        permissions: adminData.permissions,
        department: adminData.department,
      });

      await admin.save();
      console.log(`Admin ${adminData.username} created.`);
    }
  } catch (err) {
    console.error("Error seeding admins:", err);
  }
};

module.exports = seedAdmins;
