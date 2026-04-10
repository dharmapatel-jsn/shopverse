const Product = require("../models/Product");
const ApiError = require("../utils/apiError");

const listAdminProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  return res.json({ success: true, data: products });
};

const getAdminProductById = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.json({ success: true, data: product });
};

const createAdminProduct = async (req, res) => {
  const product = await Product.create(req.body);
  return res.status(201).json({ success: true, data: product });
};

const updateAdminProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.json({ success: true, data: product });
};

const deleteAdminProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.json({ success: true, message: "Product deleted" });
};

module.exports = {
  listAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
};
