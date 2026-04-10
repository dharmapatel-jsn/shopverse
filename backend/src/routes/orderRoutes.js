const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAdminToken } = require("../middlewares/auth");
const { onlyManager, auditAction } = require("../middlewares/rbac");
const {
  listOrders,
  updateOrderStatus,
  updateTrackingNumber,
  createRefund,
} = require("../controllers/orderController");

const router = express.Router();

// All order routes require admin authentication
router.use(verifyAdminToken);

router.get("/", asyncHandler(listOrders));
router.patch("/:id/status", onlyManager, auditAction("Updated order status"), asyncHandler(updateOrderStatus));
router.patch("/:id/tracking", onlyManager, auditAction("Updated tracking number"), asyncHandler(updateTrackingNumber));
router.post("/:id/refund", onlyManager, auditAction("Created refund"), asyncHandler(createRefund));

module.exports = router;
