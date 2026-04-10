/**
 * One-time migration to:
 * 1) hash existing plain-text passwords in MongoDB
 * 2) update emails using first name
 * 3) set user phone numbers to a fixed value
 * Run with: NODE_ENV=production node scripts/hashExistingPasswords.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../src/models/User");
const AdminUser = require("../src/models/AdminUser");

const isBcryptHash = (value) => typeof value === "string" && value.startsWith("$2");

const hashPasswordIfNeeded = async (password) => {
  if (!password || isBcryptHash(password)) {
    return password;
  }

  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

const normalizeNamePart = (value) => {
  if (!value || typeof value !== "string") return "user";
  const token = value.trim().split(/\s+/)[0] || "user";
  const normalized = token.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized || "user";
};

const generateUniqueEmail = (baseName, usedEmails, domain = "shopverse.com") => {
  let candidate = `${baseName}@${domain}`;
  let counter = 1;

  while (usedEmails.has(candidate)) {
    counter += 1;
    candidate = `${baseName}${counter}@${domain}`;
  }

  usedEmails.add(candidate);
  return candidate;
};

const buildUserEmails = (docs) => {
  const used = new Set();
  const byId = new Map();

  for (const doc of docs) {
    if (doc.email) {
      used.add(String(doc.email).toLowerCase());
    }
  }

  for (const doc of docs) {
    const baseName = normalizeNamePart(doc.name);
    const nextEmail = generateUniqueEmail(baseName, used);
    byId.set(String(doc._id), nextEmail);
  }

  return byId;
};

const migratePasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const users = await User.find().select("+password");
    const userEmails = buildUserEmails(users);
    let updatedUserCount = 0;

    for (const user of users) {
      let shouldSave = false;
      const updatePayload = {};
      const hashedPassword = await hashPasswordIfNeeded(user.password);
      if (hashedPassword !== user.password) {
        updatePayload.password = hashedPassword;
        shouldSave = true;
      }

      const targetEmail = userEmails.get(String(user._id));
      if (targetEmail && user.email !== targetEmail) {
        updatePayload.email = targetEmail;
        shouldSave = true;
      }

      if (user.phone !== "9876543210") {
        updatePayload.phone = "9876543210";
        shouldSave = true;
      }

      if (shouldSave) {
        await User.updateOne({ _id: user._id }, { $set: updatePayload });
        updatedUserCount += 1;
      }
    }

    const adminUsers = await AdminUser.find().select("+password");
    const adminEmails = buildUserEmails(adminUsers);
    let updatedAdminCount = 0;

    for (const adminUser of adminUsers) {
      let shouldSave = false;
      const updatePayload = {};
      const hashedPassword = await hashPasswordIfNeeded(adminUser.password);
      if (hashedPassword !== adminUser.password) {
        updatePayload.password = hashedPassword;
        shouldSave = true;
      }

      const targetEmail = adminEmails.get(String(adminUser._id));
      if (targetEmail && adminUser.email !== targetEmail) {
        updatePayload.email = targetEmail;
        shouldSave = true;
      }

      if (shouldSave) {
        await AdminUser.updateOne({ _id: adminUser._id }, { $set: updatePayload });
        updatedAdminCount += 1;
      }
    }

    console.log(`✓ Updated ${updatedUserCount} user record(s)`);
    console.log(`✓ Updated ${updatedAdminCount} admin user record(s)`);

    await mongoose.connection.close();
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("❌ Password migration failed:", error.message);
    process.exit(1);
  }
};

migratePasswords();
