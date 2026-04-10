const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

// Valid roles in the system
const VALID_ROLES = ["super_admin", "manager", "support"];

/**
 * Verify JWT token for regular users
 */
const verifyUserToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new ApiError(401, "No token provided. Authorization required."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired. Please login again."));
    }
    return next(new ApiError(401, "Invalid or malformed token."));
  }
};

/**
 * Verify JWT token for admin users
 */
const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new ApiError(401, "No token provided. Admin authorization required."));
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Admin token expired. Please login again."));
    }
    return next(new ApiError(401, "Invalid or malformed admin token."));
  }
};

/**
 * Optionally verify admin JWT token when present.
 * Useful for bootstrap endpoints that are public until the first admin exists.
 */
const optionalAdminToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Admin token expired. Please login again."));
    }
    return next(new ApiError(401, "Invalid or malformed admin token."));
  }
};

/**
 * Require specific roles for admin endpoints
 */
const requireRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.admin) {
    return next(new ApiError(401, "Admin authentication required."));
  }

  if (!allowedRoles.includes(req.admin.role)) {
    return next(
      new ApiError(
        403,
        `Insufficient permissions. Required roles: ${allowedRoles.join(", ")}. Your role: ${req.admin.role}`
      )
    );
  }

  next();
};

/**
 * Generic role checker middleware
 */
const checkRole = (req, res, next) => {
  if (!req.admin || !VALID_ROLES.includes(req.admin.role)) {
    return next(new ApiError(403, "Invalid admin role."));
  }
  next();
};

module.exports = {
  verifyUserToken,
  verifyAdminToken,
  optionalAdminToken,
  requireRoles,
  checkRole,
  VALID_ROLES,
};
