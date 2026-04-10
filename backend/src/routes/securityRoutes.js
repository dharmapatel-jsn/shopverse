const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  listAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  updateAdminRole,
  appendLoginAudit,
} = require("../controllers/securityController");

const router = express.Router();

router.get("/admins", asyncHandler(listAdminUsers));
router.get("/admins/:id", asyncHandler(getAdminUserById));
router.post("/admins", asyncHandler(createAdminUser));
router.put("/admins/:id", asyncHandler(updateAdminUser));
router.patch("/admins/:id/role", asyncHandler(updateAdminRole));
router.post("/admins/:id/login-audit", asyncHandler(appendLoginAudit));

module.exports = router;
