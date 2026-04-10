const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAdminToken } = require("../middlewares/auth");
const { requireRoles, auditAction } = require("../middlewares/rbac");
const {
  listAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} = require("../controllers/adminProductController");

const router = express.Router();

// All admin product routes require authentication
router.use(verifyAdminToken);

// Read routes - accessible to all authenticated admins
router.get("/", asyncHandler(listAdminProducts));
router.get("/:id", asyncHandler(getAdminProductById));

// Write routes - require manager or above
router.post("/", requireRoles("super_admin", "manager"), auditAction("Created product"), asyncHandler(createAdminProduct));
router.patch("/:id", requireRoles("super_admin", "manager"), auditAction("Updated product"), asyncHandler(updateAdminProduct));
router.delete("/:id", requireRoles("super_admin", "manager"), auditAction("Deleted product"), asyncHandler(deleteAdminProduct));

module.exports = router;
