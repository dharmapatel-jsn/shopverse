const ApiError = require("../utils/apiError");

/**
 * Role-Based Access Control (RBAC) Middleware
 * Roles: super_admin > manager > support
 */

const ROLE_HIERARCHY = {
  super_admin: 3,
  manager: 2,
  support: 1,
};

/**
 * Check if admin has required role(s)
 */
const requireRoles = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return next(new ApiError(401, "Admin authentication required"));
    }

    const adminRole = req.admin.role;
    const hasRequiredRole = requiredRoles.includes(adminRole);

    if (!hasRequiredRole) {
      return next(
        new ApiError(
          403,
          `Access denied. Required roles: ${requiredRoles.join(", ")}. Your role: ${adminRole}`
        )
      );
    }

    next();
  };
};

/**
 * Check if admin has minimum role level
 * Example: requireMinimumRole('manager') allows both manager and super_admin
 */
const requireMinimumRole = (minimumRole) => {
  return (req, res, next) => {
    if (!req.admin) {
      return next(new ApiError(401, "Admin authentication required"));
    }

    const adminRoleLevel = ROLE_HIERARCHY[req.admin.role];
    const minimumRoleLevel = ROLE_HIERARCHY[minimumRole];

    if (adminRoleLevel < minimumRoleLevel) {
      return next(
        new ApiError(
          403,
          `Access denied. Minimum required role: ${minimumRole}. Your role: ${req.admin.role}`
        )
      );
    }

    next();
  };
};

/**
 * Only super_admin can perform this action
 */
const onlySuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== "super_admin") {
    return next(
      new ApiError(403, "This action is restricted to super administrators only")
    );
  }
  next();
};

/**
 * Only manager or above can perform this action
 */
const onlyManager = (req, res, next) => {
  if (!req.admin || !["super_admin", "manager"].includes(req.admin.role)) {
    return next(
      new ApiError(403, "This action requires manager or above privileges")
    );
  }
  next();
};

/**
 * Audit action - log admin actions for compliance
 */
const auditAction = (actionDescription) => {
  return (req, res, next) => {
    // Log the action (implement according to your logging strategy)
    console.log(`[AUDIT] Admin: ${req.admin?.email}, Action: ${actionDescription}, IP: ${req.ip}, Time: ${new Date().toISOString()}`);

    // Attach audit info to response if needed
    res.on("finish", () => {
      // Log result status
      console.log(`[AUDIT] Admin: ${req.admin?.email}, Action: ${actionDescription}, Status: ${res.statusCode}`);
    });

    next();
  };
};

module.exports = {
  requireRoles,
  requireMinimumRole,
  onlySuperAdmin,
  onlyManager,
  auditAction,
  ROLE_HIERARCHY,
};
