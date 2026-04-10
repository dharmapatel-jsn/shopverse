const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { optionalAdminToken, verifyAdminToken } = require("../middlewares/auth");
const { auditAction } = require("../middlewares/rbac");
const {
  signupAdmin,
  signInAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} = require("../controllers/adminAuthController");

const router = express.Router();

// Public routes
router.post("/signin", asyncHandler(signInAdmin));

// Bootstrap/public signup route; requires super_admin token after the first admin exists
router.post("/signup", optionalAdminToken, auditAction("Created new admin account"), asyncHandler(signupAdmin));
router.get("/profile", verifyAdminToken, asyncHandler(getAdminProfile));
router.put("/profile", verifyAdminToken, asyncHandler(updateAdminProfile));
router.post("/change-password", verifyAdminToken, asyncHandler(changeAdminPassword));

module.exports = router;
