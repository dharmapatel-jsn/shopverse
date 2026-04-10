const Order = require("../models/Order");
const ActivityLog = require("../models/ActivityLog");

const getCustomers = async (req, res) => {
  const customers = await Order.aggregate([
    {
      $group: {
        _id: "$customerEmail",
        customerName: { $first: "$customerName" },
        totalOrders: { $sum: 1 },
        orderValue: { $sum: "$totalAmount" },
        lastOrderAt: { $max: "$createdAt" },
      },
    },
    { $sort: { orderValue: -1 } },
  ]);

  return res.json({ success: true, data: customers });
};

const getCustomerActivityLog = async (req, res) => {
  const { customerId } = req.params;
  const logs = await ActivityLog.find({ actorType: "customer", actorId: customerId })
    .sort({ createdAt: -1 })
    .limit(100);

  return res.json({ success: true, data: logs });
};

module.exports = {
  getCustomers,
  getCustomerActivityLog,
};
