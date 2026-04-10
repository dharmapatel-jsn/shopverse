const Product = require("../models/Product");
const ApiError = require("../utils/apiError");

const getInventory = async (req, res) => {
  const products = await Product.find().sort({ updatedAt: -1 });
  return res.json({ success: true, data: products });
};

const adjustStock = async (req, res) => {
  const { id } = req.params;
  const { delta } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.stock = Math.max(0, product.stock + Number(delta || 0));
  await product.save();

  return res.json({ success: true, data: product });
};

const updateSupplierNote = async (req, res) => {
  const { id } = req.params;
  const { supplierNote } = req.body;

  const product = await Product.findByIdAndUpdate(
    id,
    { supplierNote },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.json({ success: true, data: product });
};

const updateLowStockThreshold = async (req, res) => {
  const { id } = req.params;
  const { lowStockThreshold } = req.body;

  const product = await Product.findByIdAndUpdate(
    id,
    { lowStockThreshold },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.json({ success: true, data: product });
};

module.exports = {
  getInventory,
  adjustStock,
  updateSupplierNote,
  updateLowStockThreshold,
};
