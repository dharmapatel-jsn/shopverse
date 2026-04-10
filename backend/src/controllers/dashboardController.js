const Order = require("../models/Order");
const Product = require("../models/Product");

const getDashboardMetrics = async (req, res) => {
  const [
    revenueChart,
    ordersTrend,
    lowStockProducts,
    topCategories,
    failedPayments,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Product.find({ $expr: { $lte: ["$stock", "$lowStockThreshold"] } })
      .select("name sku stock lowStockThreshold category")
      .limit(10),
    Product.aggregate([
      { $group: { _id: "$category", totalProducts: { $sum: 1 } } },
      { $sort: { totalProducts: -1 } },
      { $limit: 5 },
    ]),
    Order.countDocuments({ paymentStatus: "failed" }),
  ]);

  return res.json({
    success: true,
    data: {
      revenueChart,
      ordersTrend,
      lowStockProducts,
      topCategories,
      failedPayments,
    },
  });
};

module.exports = {
  getDashboardMetrics,
};
