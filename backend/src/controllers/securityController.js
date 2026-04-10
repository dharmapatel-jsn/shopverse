const AdminUser = require("../models/AdminUser");
const ApiError = require("../utils/apiError");

const listAdminUsers = async (req, res) => {
  const users = await AdminUser.find().sort({ createdAt: -1 });
  return res.json({ success: true, data: users });
};

const getAdminUserById = async (req, res) => {
  const { id } = req.params;

  const user = await AdminUser.findById(id);
  if (!user) {
    throw new ApiError(404, "Admin user not found");
  }

  return res.json({ success: true, data: user });
};

const updateAdminUser = async (req, res) => {
  const { id } = req.params;

  const user = await AdminUser.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, "Admin user not found");
  }

  return res.json({ success: true, data: user });
};

const createAdminUser = async (req, res) => {
  const user = await AdminUser.create(req.body);
  return res.status(201).json({ success: true, data: user });
};

const updateAdminRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await AdminUser.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, "Admin user not found");
  }

  return res.json({ success: true, data: user });
};

const appendLoginAudit = async (req, res) => {
  const { id } = req.params;
  const { ipAddress, userAgent, status } = req.body;

  const user = await AdminUser.findById(id);
  if (!user) {
    throw new ApiError(404, "Admin user not found");
  }

  user.loginAuditTrail.push({ ipAddress, userAgent, status });
  await user.save();

  return res.json({ success: true, data: user.loginAuditTrail });
};

module.exports = {
  listAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  updateAdminRole,
  appendLoginAudit,
};
