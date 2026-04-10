const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    actorType: { type: String, enum: ["admin", "customer"], required: true },
    actorId: { type: String, required: true },
    action: { type: String, required: true, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
