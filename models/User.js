const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxLength: [50, "Full name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      select: false,
      required: [
        function passwordRequired() {
          return !this.googleSubjectId;
        },
        "Password is required",
      ],
    },
    googleSubjectId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    baseCurrency: {
      type: String,
      default: "INR",
      enum: ["USD", "EUR", "GBP", "INR", "JPY", "CNY"],
    },
    theme: {
      type: String,
      default: "light",
      enum: ["light", "dark"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.hashPassword = async function hashPassword() {
  const user = this;
  if (!user.password) {
    return;
  }
  const passwordHash = await bcrypt.hash(user.password, 10);
  user.password = passwordHash;
};

userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword,
) {
  const user = this;
  if (!user.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, user.password);
};

userSchema.methods.generateAuthToken = function generateAuthToken() {
  const user = this;
  return jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
