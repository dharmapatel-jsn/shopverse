const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("insertMany", async function (docs) {
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
userSchema.methods.comparePassword = async function (plaintextPassword) {
  return await bcrypt.compare(plaintextPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
