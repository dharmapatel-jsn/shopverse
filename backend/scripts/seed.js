/**
 * Seed script to populate test data in MongoDB
 * Run with: NODE_ENV=test node scripts/seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Product = require("../src/models/Product");
const User = require("../src/models/User");
const AdminUser = require("../src/models/AdminUser");
const Order = require("../src/models/Order");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await AdminUser.deleteMany({});
    await Order.deleteMany({});

    // Seed products
    const sampleProducts = [
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaead1"),
        name: "Laptop Pro 15",
        sku: "LAPTOP-001",
        category: "Electronics",
        price: 1299.99,
        stock: 25,
        lowStockThreshold: 5,
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaead2"),
        name: "Wireless Mouse",
        sku: "MOUSE-001",
        category: "Accessories",
        price: 29.99,
        stock: 150,
        lowStockThreshold: 10,
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaead3"),
        name: "USB-C Cable",
        sku: "CABLE-001",
        category: "Accessories",
        price: 15.99,
        stock: 200,
        lowStockThreshold: 20,
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaead4"),
        name: "Mechanical Keyboard",
        sku: "KEYBOARD-001",
        category: "Accessories",
        price: 149.99,
        stock: 45,
        lowStockThreshold: 8,
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaead5"),
        name: "4K Monitor",
        sku: "MONITOR-001",
        category: "Electronics",
        price: 399.99,
        stock: 18,
        lowStockThreshold: 4,
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaead6"),
        name: "Webcam HD",
        sku: "WEBCAM-001",
        category: "Electronics",
        price: 79.99,
        stock: 60,
        lowStockThreshold: 10,
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaead7"),
        name: "Phone Stand",
        sku: "STAND-001",
        category: "Accessories",
        price: 24.99,
        stock: 120,
        lowStockThreshold: 15,
        isActive: true,
      },
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaead8"),
        name: "Laptop Backpack",
        sku: "BACKPACK-001",
        category: "Bags",
        price: 59.99,
        stock: 40,
        lowStockThreshold: 6,
        isActive: true,
      },
    ];

    const products = await Product.insertMany(sampleProducts);
    console.log(`✓ Seeded ${products.length} products`);

    // Seed users
    const sampleUsers = [
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaead9"),
        name: "Aarav Patel",
        email: "john@example.com",
        phone: "555-0001",
        password: "password123",
        address: "Shopverse Tower, Kalavad Road",
        city: "Rajkot",
        state: "Gujarat",
        zipCode: "360001",
      },
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaeada"),
        name: "Nirali Shah",
        email: "jane@example.com",
        phone: "555-0002",
        password: "password123",
        address: "Shree Rang Residency, Raiya Road",
        city: "Rajkot",
        state: "Gujarat",
        zipCode: "360007",
      },
      {
        _id: new mongoose.Types.ObjectId("69d3f3d42546a184cdfaeadb"),
        name: "Harsh Mehta",
        email: "bob@example.com",
        phone: "555-0003",
        password: "password123",
        address: "Bhakti Nagar Circle",
        city: "Rajkot",
        state: "Gujarat",
        zipCode: "360002",
      },
    ];

    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_ROUNDS) || 10),
      }))
    );

    const users = await User.insertMany(hashedUsers);
    console.log(`✓ Seeded ${users.length} users`);

    const adminPasswordHash = await bcrypt.hash("AdminPassword123!", parseInt(process.env.BCRYPT_ROUNDS) || 10);

    const adminUsers = await AdminUser.insertMany([
      {
        _id: new mongoose.Types.ObjectId("69d3ee2469fce9ec030df850"),
        name: "Aarav Admin Patel",
        email: "admin@shopverse.com",
        password: adminPasswordHash,
        role: "super_admin",
        isActive: true,
        loginAuditTrail: [],
      },
    ]);
    console.log(`✓ Seeded ${adminUsers.length} admin user`);

    const orders = await Order.insertMany([
      {
        _id: new mongoose.Types.ObjectId("69d3ee2469fce9ec030df851"),
        customerName: "Aarav Patel",
        customerEmail: "john@example.com",
        items: [
          {
            productId: products[0]._id,
            quantity: 1,
            price: products[0].price,
          },
        ],
        totalAmount: products[0].price,
        status: "confirmed",
        paymentStatus: "paid",
        trackingNumber: "TRK-RAJ-101",
      },
      {
        _id: new mongoose.Types.ObjectId("69d3ee2469fce9ec030df852"),
        customerName: "Nirali Shah",
        customerEmail: "jane@example.com",
        items: [
          {
            productId: products[1]._id,
            quantity: 2,
            price: products[1].price,
          },
        ],
        totalAmount: products[1].price * 2,
        status: "pending",
        paymentStatus: "failed",
        trackingNumber: "",
      },
    ]);
    console.log(`✓ Seeded ${orders.length} orders`);

    console.log("\n✅ Seed data created successfully!");
    console.log("\nSample User IDs (for testing):");
    users.forEach((user) => {
      console.log(`  - ${user.email}: ${user._id}`);
    });

    console.log("\nSample Admin ID (for testing):");
    adminUsers.forEach((adminUser) => {
      console.log(`  - ${adminUser.email}: ${adminUser._id}`);
    });

    console.log("\nSample Order IDs (for testing):");
    orders.forEach((order) => {
      console.log(`  - ${order.customerName}: ${order._id}`);
    });

    console.log("\nSample Product IDs (for testing):");
    products.forEach((product) => {
      console.log(`  - ${product.name}: ${product._id}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedData();
