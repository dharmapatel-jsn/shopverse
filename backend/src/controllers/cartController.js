const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ApiError = require("../utils/apiError");

/**
 * Get user cart - GET /api/cart/:userId
 */
const getCart = async (req, res) => {
  const { userId } = req.params;

  let cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart) {
    cart = await Cart.create({ userId, items: [], totalPrice: 0 });
  }

  return res.json({ success: true, data: cart });
};

/**
 * Add item to cart - POST /api/cart/:userId/add
 */
const addToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Insufficient stock");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const existingItem = cart.items.find((item) => item.productId.toString() === productId);

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      productId,
      quantity: Number(quantity),
      price: product.price,
    });
  }

  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  await cart.save();

  return res.json({
    success: true,
    message: "Item added to cart",
    data: cart,
  });
};

/**
 * Update cart item quantity - PATCH /api/cart/:userId/item/:productId
 */
const updateCartItem = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) {
    throw new ApiError(404, "Item not in cart");
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  cart.totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  await cart.save();

  return res.json({
    success: true,
    message: "Cart updated",
    data: cart,
  });
};

/**
 * Remove item from cart - DELETE /api/cart/:userId/item/:productId
 */
const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await cart.save();

  return res.json({
    success: true,
    message: "Item removed from cart",
    data: cart,
  });
};

/**
 * Clear cart - DELETE /api/cart/:userId/clear
 */
const clearCart = async (req, res) => {
  const { userId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return res.json({
    success: true,
    message: "Cart cleared",
    data: cart,
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
