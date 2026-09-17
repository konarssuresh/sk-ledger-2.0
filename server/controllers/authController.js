const connectDb = require("../../lib/db");
const User = require("../../models/User");
const { verifyGoogleCredential } = require("../../lib/google-auth");
const { resolveUserForGoogleLogin } = require("../services/google-account");
const { toPublicUser } = require("../../lib/auth/public-user");
const { AppError, NotFoundError } = require("../../lib/errors");
const {
  validateSignupReq,
  validateLoginReq,
  validateGoogleLogin,
  validateUpdateProfileReq,
  validateChangePasswordReq,
  validatePreferenceRequest,
} = require("../../lib/validators");

async function signup(body) {
  await connectDb();
  validateSignupReq({ body });
  const { fullName, email, password, baseCurrency } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered");
  }

  const user = new User({ fullName, email, password, baseCurrency });
  await user.hashPassword();
  await user.save();

  return { status: 201, body: { message: "User registered successfully" } };
}

async function login(body) {
  await connectDb();
  validateLoginReq({ body });
  const { email, password } = body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password");
  }

  const token = user.generateAuthToken();
  return {
    status: 200,
    body: { message: "Login successful" },
    token,
  };
}

async function signout() {
  return {
    status: 200,
    body: { message: "Logout successful" },
    clearCookie: true,
  };
}

async function getCurrentUser(user) {
  return {
    status: 200,
    body: { user: toPublicUser(user) },
  };
}

async function updatePreference(user, body) {
  await connectDb();
  validatePreferenceRequest({ body });

  const existingUser = await User.findOne({ _id: user._id });
  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  const { currency, theme } = body;
  if (currency) {
    existingUser.baseCurrency = currency;
  }
  if (theme) {
    existingUser.theme = theme;
  }
  await existingUser.save();

  const saved = existingUser.toObject();
  delete saved.password;

  return { status: 200, body: saved };
}

async function signinWithGoogle(body) {
  try {
    await connectDb();
    validateGoogleLogin({ body });
    const { credential } = body;

    const payload = await verifyGoogleCredential(credential);
    const user = await resolveUserForGoogleLogin(payload);
    const token = user.generateAuthToken();

    return {
      status: 200,
      body: payload,
      token,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message);
  }
}

async function updateProfile(user, body) {
  await connectDb();
  validateUpdateProfileReq({ body });

  const record = await User.findById(user._id);
  if (!record) {
    throw new NotFoundError("User not found");
  }

  const { fullName, email } = body;
  let emailUpdated = false;

  if (fullName !== undefined) {
    record.fullName = String(fullName).trim();
  }

  if (email !== undefined) {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (normalizedEmail !== record.email) {
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: record._id },
      });
      if (existingUser) {
        throw new AppError("Email is already registered");
      }
      record.email = normalizedEmail;
      record.verified = false;
      emailUpdated = true;
    }
  }

  await record.save();

  return {
    status: 200,
    body: {
      message: "Profile updated successfully",
      emailVerificationRequired: emailUpdated,
      user: {
        id: record._id,
        fullName: record.fullName,
        email: record.email,
        verified: record.verified,
        baseCurrency: record.baseCurrency,
        theme: record.theme,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
    },
  };
}

async function changePassword(user, body) {
  await connectDb();
  validateChangePasswordReq({ body });
  const { currentPassword, newPassword } = body;

  const record = await User.findById(user._id).select("+password");
  if (!record) {
    throw new NotFoundError("User not found");
  }

  const isCurrentPasswordValid = await record.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect");
  }

  const isSameAsCurrent = await record.comparePassword(newPassword);
  if (isSameAsCurrent) {
    throw new AppError("New password must be different from current password");
  }

  record.password = newPassword;
  await record.hashPassword();
  await record.save();

  return {
    status: 200,
    body: { message: "Password changed successfully" },
  };
}

module.exports = {
  signup,
  login,
  signout,
  getCurrentUser,
  updatePreference,
  signinWithGoogle,
  updateProfile,
  changePassword,
};
