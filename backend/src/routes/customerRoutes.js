const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  getCustomers,
  getCustomerActivityLog,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/", asyncHandler(getCustomers));
router.get("/:customerId/activity", asyncHandler(getCustomerActivityLog));

module.exports = router;
