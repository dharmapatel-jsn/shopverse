const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  listProducts,
  getProductById,
  getFeaturedProducts,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", asyncHandler(listProducts));
router.get("/featured/list", asyncHandler(getFeaturedProducts));
router.get("/:id", asyncHandler(getProductById));

module.exports = router;
