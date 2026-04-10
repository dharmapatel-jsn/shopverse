const Order = require("../models/Order");
const ActivityLog = require("../models/ActivityLog");
const ApiError = require("../utils/apiError");

const listOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
  return res.json({ success: true, data: orders });
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();

  await ActivityLog.create({
    actorType: "admin",
    actorId: req.admin.id,
    action: "ORDER_STATUS_UPDATED",
    metadata: { orderId: id, status },
  });

  return res.json({ success: true, data: order });
};

const updateTrackingNumber = async (req, res) => {
  const { id } = req.params;
  const { trackingNumber } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.trackingNumber = trackingNumber;
  await order.save();

  return res.json({ success: true, data: order });
};

const createRefund = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = "refunded";
  order.refundAmount = amount;
  order.refundedAt = new Date();
  await order.save();

  await ActivityLog.create({
    actorType: "admin",
    actorId: req.admin.id,
    action: "ORDER_REFUNDED",
    metadata: { orderId: id, amount },
  });

  return res.json({ success: true, data: order });
};

module.exports = {
  listOrders,
  updateOrderStatus,
  updateTrackingNumber,
  createRefund,
};
