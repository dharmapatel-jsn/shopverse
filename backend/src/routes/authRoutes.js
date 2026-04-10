const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { verifyUserToken } = require("../middlewares/auth");
const {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const router = express.Router();

// Public routes
router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));

// Protected routes (require JWT token)
router.get("/profile/:id", verifyUserToken, asyncHandler(getProfile));
router.put("/profile/:id", verifyUserToken, asyncHandler(updateProfile));
router.post("/change-password/:id", verifyUserToken, asyncHandler(changePassword));

module.exports = router;
