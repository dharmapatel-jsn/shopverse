const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/apiError");

/**
 * Generate JWT token for user
 */
const generateToken = (userId) => {
  return jwt.sign({ userId, type: "user" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/**
 * User signup - POST /api/auth/signup
 */
const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  const user = await User.create({
    name,
    email,
    password, // Will be hashed by model pre-save hook
    phone,
  });

  const token = generateToken(user._id);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

/**
 * User login - POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare passwords using bcrypt
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "User account is inactive");
  }

  const token = generateToken(user._id);

  return res.json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

/**
 * Get user profile - GET /api/auth/profile/:id
 */
const getProfile = async (req, res) => {
  const { id } = req.params;

  // Verify user is requesting their own profile or is authorized
  if (req.user.userId !== id && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized access to profile");
  }

  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.json({ success: true, data: user });
};

/**
 * Update user profile - PUT /api/auth/profile/:id
 */
const updateProfile = async (req, res) => {
  const { id } = req.params;

  // Verify user is updating their own profile or is authorized
  if (req.user.userId !== id && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized access to profile");
  }

  // Prevent password updates via this endpoint
  if (req.body.password) {
    throw new ApiError(400, "Cannot update password via this endpoint. Use /change-password instead.");
  }

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
};

/**
 * Change password - POST /api/auth/change-password
 */
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Verify user is updating their own password or is authorized
  if (req.user.userId !== id && req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized access");
  }

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  const user = await User.findById(id).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return res.json({
    success: true,
    message: "Password changed successfully",
  });
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
