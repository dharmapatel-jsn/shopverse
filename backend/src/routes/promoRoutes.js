const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAdminToken } = require("../middlewares/auth");
const { requireRoles, auditAction } = require("../middlewares/rbac");
const {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  listBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/promoController");

const router = express.Router();

// All promo routes require admin authentication
router.use(verifyAdminToken);

// Coupon routes
router.get("/coupons", asyncHandler(listCoupons));
router.post("/coupons", requireRoles("super_admin", "manager"), auditAction("Created coupon"), asyncHandler(createCoupon));
router.patch("/coupons/:id", requireRoles("super_admin", "manager"), auditAction("Updated coupon"), asyncHandler(updateCoupon));
router.delete("/coupons/:id", requireRoles("super_admin", "manager"), auditAction("Deleted coupon"), asyncHandler(deleteCoupon));

// Banner routes
router.get("/banners", asyncHandler(listBanners));
router.post("/banners", requireRoles("super_admin", "manager"), auditAction("Created banner"), asyncHandler(createBanner));
router.patch("/banners/:id", requireRoles("super_admin", "manager"), auditAction("Updated banner"), asyncHandler(updateBanner));
router.delete("/banners/:id", requireRoles("super_admin", "manager"), auditAction("Deleted banner"), asyncHandler(deleteBanner));

module.exports = router;
