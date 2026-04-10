const Coupon = require("../models/Coupon");
const Banner = require("../models/Banner");
const ApiError = require("../utils/apiError");

const listCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return res.json({ success: true, data: coupons });
};

const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  return res.status(201).json({ success: true, data: coupon });
};

const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  return res.json({ success: true, data: coupon });
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  return res.json({ success: true, message: "Coupon deleted" });
};

const listBanners = async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  return res.json({ success: true, data: banners });
};

const createBanner = async (req, res) => {
  const banner = await Banner.create(req.body);
  return res.status(201).json({ success: true, data: banner });
};

const updateBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  return res.json({ success: true, data: banner });
};

const deleteBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findByIdAndDelete(id);

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  return res.json({ success: true, message: "Banner deleted" });
};

module.exports = {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  listBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
