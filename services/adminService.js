const Admin = require("../models/admin/admin");

const getAllAdmins = async () => {
  return await Admin.find({});
};

const getAdminByUserId = async (userId) => {
  return await Admin.findOne({ user: userId }).populate("user").exec();
};

const addAdmin = async (adminData) => {
  const admin = new Admin(adminData);
  return await admin.save();
};

const updateAdmin = async (adminId, updateData) => {
  return await Admin.findByIdAndUpdate(adminId, updateData, { new: true });
};

const deleteAdmin = async (adminId) => {
  return await Admin.findByIdAndDelete(adminId);
};

module.exports = {
  getAllAdmins,
  getAdminByUserId,
  addAdmin,
  updateAdmin,
  deleteAdmin,
};
