const Product = require("../models/Product");
const ApiError = require("../utils/apiError");

/**
 * Get all products - GET /api/products
 * Query params: category, minPrice, maxPrice, search, page, limit
 */
const listProducts = async (req, res) => {
  const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

  const filter = { isActive: true };

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

/**
 * Get single product - GET /api/products/:id
 */
const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.json({ success: true, data: product });
};

/**
 * Get featured products for home - GET /api/products/featured/list
 */
const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isActive: true }).limit(8).sort({ createdAt: -1 });

  return res.json({
    success: true,
    message: "Featured products for home page",
    data: products,
  });
};

module.exports = {
  listProducts,
  getProductById,
  getFeaturedProducts,
};
