const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAdminToken } = require("../middlewares/auth");
const { getDashboardMetrics } = require("../controllers/dashboardController");

const router = express.Router();

// Dashboard requires authentication
router.get("/", verifyAdminToken, asyncHandler(getDashboardMetrics));

module.exports = router;
