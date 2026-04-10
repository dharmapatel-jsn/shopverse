const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/:userId", asyncHandler(getCart));
router.post("/:userId/add", asyncHandler(addToCart));
router.patch("/:userId/item/:productId", asyncHandler(updateCartItem));
router.delete("/:userId/item/:productId", asyncHandler(removeFromCart));
router.delete("/:userId/clear", asyncHandler(clearCart));

module.exports = router;
