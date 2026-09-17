const User = require("../models/User");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const { signSessionToken } = require("../lib/auth/jwt");

const createUser = async (overrides = {}) => {
  const email =
    overrides.email || `user-${Date.now()}-${Math.random()}@test.com`;
  const user = new User({
    fullName: "Test User",
    email,
    password: overrides.password || "Pass@1234",
    baseCurrency: "INR",
    ...overrides,
  });
  if (user.password) {
    await user.hashPassword();
  }
  await user.save();
  return user;
};

const createGoogleUser = async (overrides = {}) => {
  const googleSubjectId =
    overrides.googleSubjectId ||
    `google-sub-${Date.now()}-${Math.random()}`;
  const email =
    overrides.email || `google-${Date.now()}-${Math.random()}@test.com`;

  const user = new User({
    fullName: overrides.fullName || "Google User",
    email,
    googleSubjectId,
    verified: overrides.verified !== undefined ? overrides.verified : true,
    baseCurrency: overrides.baseCurrency || "INR",
    theme: overrides.theme || "light",
  });
  await user.save();
  return user;
};

const authTokenForUser = (user) => signSessionToken(user._id);

const authCookieForUser = (user) => [`token=${authTokenForUser(user)}`];

const createCategory = async (user, overrides = {}) => {
  const category = await Category.create({
    name: "Food",
    type: "expense",
    emoji: "🍔",
    userId: user._id,
    ...overrides,
  });
  return category;
};

const createTransaction = async (user, category, overrides = {}) => {
  return Transaction.create({
    name: "Lunch",
    amount: 200,
    currency: "INR",
    categoryId: category._id,
    note: "",
    date: new Date("2026-02-12T10:00:00.000Z"),
    userId: user._id,
    type: "expense",
    ...overrides,
  });
};

module.exports = {
  createUser,
  createGoogleUser,
  authTokenForUser,
  authCookieForUser,
  createCategory,
  createTransaction,
};
