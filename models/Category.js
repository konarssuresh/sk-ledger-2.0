const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: [30, "Category name cannot exceed 30 characters"],
  },
  type: {
    type: String,
    required: true,
    enum: ["income", "expense", "savings"],
  },
  emoji: {
    type: String,
    default: function defaultEmoji() {
      const map = {
        income: "💰",
        savings: "🏦",
        expense: "💸",
      };
      return map[this.type] || "📌";
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [
      function userIdRequired() {
        return this.isDefault !== true;
      },
      "userId is required when isDefault is true",
    ],
  },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = Category;
