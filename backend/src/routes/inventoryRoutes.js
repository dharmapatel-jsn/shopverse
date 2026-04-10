const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAdminToken } = require("../middlewares/auth");
const { onlyManager, requireRoles, auditAction } = require("../middlewares/rbac");
const {
  getInventory,
  adjustStock,
  updateSupplierNote,
  updateLowStockThreshold,
} = require("../controllers/inventoryController");

const router = express.Router();

// All inventory routes require admin authentication
router.use(verifyAdminToken);

router.get("/", asyncHandler(getInventory));
router.patch("/:id/adjust-stock", onlyManager, auditAction("Adjusted stock"), asyncHandler(adjustStock));
router.patch("/:id/supplier-note", onlyManager, auditAction("Updated supplier note"), asyncHandler(updateSupplierNote));
router.patch("/:id/low-stock-threshold", requireRoles("super_admin", "manager"), auditAction("Updated low stock threshold"), asyncHandler(updateLowStockThreshold));

module.exports = router;
