const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    badgeId: { type: String, required: true },
    title: String,
    description: String,
    icon: String,
    rarity: {
      type: String,
      enum: ["common", "rare", "epic"],
      default: "common",
    }
  },
  { timestamps: true }
);

const Badge = mongoose.model("badges", badgeSchema);
module.exports = Badge;