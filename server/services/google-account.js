const User = require("../../models/User");
const { AppError } = require("../../lib/errors");

function normalizeGooglePayload(payload) {
  const sub = payload?.sub;
  const email = payload?.email?.trim().toLowerCase();

  if (!sub) {
    throw new AppError("Invalid Google credential");
  }

  if (!email) {
    throw new AppError("Google account email is required");
  }

  if (payload.email_verified !== true) {
    throw new AppError("Google email is not verified");
  }

  return { sub, email, name: payload.name };
}

async function resolveUserForGoogleLogin(payload) {
  const { sub, email, name } = normalizeGooglePayload(payload);

  const existingBySub = await User.findOne({ googleSubjectId: sub });
  if (existingBySub) {
    return existingBySub;
  }

  const existingByEmail = await User.findOne({ email });
  if (existingByEmail) {
    if (
      existingByEmail.googleSubjectId &&
      existingByEmail.googleSubjectId !== sub
    ) {
      throw new AppError("Google account is already linked to another user");
    }

    const conflict = await User.findOne({
      googleSubjectId: sub,
      _id: { $ne: existingByEmail._id },
    });
    if (conflict) {
      throw new AppError("Google account is already linked to another user");
    }

    existingByEmail.googleSubjectId = sub;
    await existingByEmail.save();
    return existingByEmail;
  }

  const user = new User({
    fullName: name || email.split("@")[0],
    email,
    googleSubjectId: sub,
    verified: true,
  });

  try {
    await user.save();
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError("Google account is already linked to another user");
    }
    throw error;
  }

  return user;
}

module.exports = {
  normalizeGooglePayload,
  resolveUserForGoogleLogin,
};
