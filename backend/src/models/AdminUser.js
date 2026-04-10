const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const loginAuditSchema = new mongoose.Schema(
  {
    loginAt: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { _id: false }
);

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["super_admin", "manager", "support"],
      required: true,
      default: "support",
    },
    isActive: { type: Boolean, default: true },
    loginAuditTrail: [loginAuditSchema],
  },
  { timestamps: true }
);

// Hash password before saving
adminUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminUserSchema.pre("insertMany", async function (docs) {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;

  await Promise.all(
    docs.map(async (doc) => {
      if (doc.password && !doc.password.startsWith("$2")) {
        const salt = await bcrypt.genSalt(saltRounds);
        doc.password = await bcrypt.hash(doc.password, salt);
      }
    })
  );
});

// Method to compare passwords
adminUserSchema.methods.comparePassword = async function (plaintextPassword) {
  return await bcrypt.compare(plaintextPassword, this.password);
};

module.exports = mongoose.model("AdminUser", adminUserSchema);
