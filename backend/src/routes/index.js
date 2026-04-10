const express = require("express");
const dashboardRoutes = require("./dashboardRoutes");
const customerRoutes = require("./customerRoutes");
const promoRoutes = require("./promoRoutes");
const securityRoutes = require("./securityRoutes");
const orderRoutes = require("./orderRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const adminAuthRoutes = require("./adminAuthRoutes");
const adminProductRoutes = require("./adminProductRoutes");
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const pageRoutes = require("./pageRoutes");
const { verifyAdminToken } = require("../middlewares/auth");
const { requireRoles } = require("../middlewares/rbac");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

// User-facing routes (no auth required for now)
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/pages", pageRoutes);

// Admin routes (with role-based auth)
router.use("/admin/auth", adminAuthRoutes);
router.use("/admin", verifyAdminToken);

router.use("/admin/dashboard", requireRoles("super_admin", "manager", "support"), dashboardRoutes);
router.use("/admin/customers", requireRoles("super_admin", "manager"), customerRoutes);
router.use("/admin/products", requireRoles("super_admin", "manager"), adminProductRoutes);
router.use("/admin/promotions", requireRoles("super_admin", "manager"), promoRoutes);
router.use("/admin/security", requireRoles("super_admin"), securityRoutes);
router.use("/admin/orders", requireRoles("super_admin", "manager", "support"), orderRoutes);
router.use("/admin/inventory", requireRoles("super_admin", "manager"), inventoryRoutes);

module.exports = router;
