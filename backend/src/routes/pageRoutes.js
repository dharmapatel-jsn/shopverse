const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  getAboutPage,
  getContactPage,
  submitContactForm,
} = require("../controllers/pageController");

const router = express.Router();

router.get("/about", asyncHandler(getAboutPage));
router.get("/contact", asyncHandler(getContactPage));
router.post("/contact", asyncHandler(submitContactForm));

module.exports = router;
