const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");
const ApiError = require("../utils/apiError");

/**
 * Generate JWT token for admin
 */
const generateAdminToken = (adminId, role) => {
  return jwt.sign({ adminId, role, type: "admin" }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: process.env.JWT_ADMIN_EXPIRE || "30d",
  });
};

/**
 * Admin sign-up - POST /api/admin/auth/signup
 * Only super_admin can create new admin accounts
 */
const signupAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    throw new ApiError(400, "Name, email, password, and role are required");
  }

  // Validate role
  const validRoles = ["super_admin", "manager", "support"];
  if (!validRoles.includes(role)) {
    throw new ApiError(400, `Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }

  const adminCount = await AdminUser.countDocuments();
  const isBootstrapSignup = adminCount === 0;

  if (!isBootstrapSignup && (!req.admin || req.admin.role !== "super_admin")) {
    throw new ApiError(403, "Only super_admin can create new admin accounts");
  }

  if (isBootstrapSignup && role !== "super_admin") {
    throw new ApiError(400, "The first admin account must be a super_admin");
  }

  // Check if admin already exists
  const existingAdmin = await AdminUser.findOne({ email });
  if (existingAdmin) {
    throw new ApiError(400, "Admin with this email already exists");
  }

  // Create new admin
  const admin = await AdminUser.create({
    name,
    email,
    password, // Will be hashed by model pre-save hook
    role,
    isActive: true,
  });

  const token = generateAdminToken(admin._id, admin.role);

  return res.status(201).json({
    success: true,
    message: "Admin account created successfully",
    data: {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
  });
};

/**
 * Admin sign-in - POST /api/admin/auth/signin
 */
const signInAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find admin by email
  const admin = await AdminUser.findOne({ email }).select("+password");
  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check if admin is active
  if (!admin.isActive) {
    throw new ApiError(403, "Admin account is inactive");
  }

  // Compare passwords using bcrypt
  const isPasswordValid = await admin.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Log successful login to audit trail
  admin.loginAuditTrail.push({
    loginAt: new Date(),
    ipAddress: req.ip || "Unknown",
    userAgent: req.get("User-Agent") || "Unknown",
    status: "success",
  });

  // Keep only last 50 login records
  if (admin.loginAuditTrail.length > 50) {
    admin.loginAuditTrail = admin.loginAuditTrail.slice(-50);
  }

  await admin.save();

  const token = generateAdminToken(admin._id, admin.role);

  return res.json({
    success: true,
    message: "Admin sign in successful",
    data: {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
  });
};

/**
 * Get admin profile - GET /api/admin/auth/profile
 */
const getAdminProfile = async (req, res) => {
  const admin = await AdminUser.findById(req.admin.adminId).select("-password");

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return res.json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    },
  });
};

/**
 * Update admin profile - PUT /api/admin/auth/profile
 */
const updateAdminProfile = async (req, res) => {
  const { name, email } = req.body;

  // Prevent updating sensitive fields via this endpoint
  if (req.body.password || req.body.role || req.body.isActive) {
    throw new ApiError(400, "Cannot update password, role, or active status via this endpoint");
  }

  const admin = await AdminUser.findByIdAndUpdate(
    req.admin.adminId,
    { name, email },
    { new: true, runValidators: true }
  );

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return res.json({
    success: true,
    message: "Admin profile updated successfully",
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
};

/**
 * Change admin password - POST /api/admin/auth/change-password
 */
const changeAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  const admin = await AdminUser.findById(req.admin.adminId).select("+password");
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // Verify current password
  const isPasswordValid = await admin.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Update password
  admin.password = newPassword;
  await admin.save();

  return res.json({
    success: true,
    message: "Password changed successfully",
  });
};

module.exports = {
  signupAdmin,
  signInAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
};
