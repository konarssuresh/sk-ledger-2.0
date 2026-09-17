jest.mock("../models/User", () => {
  const User = jest.fn();
  User.findOne = jest.fn();
  User.findById = jest.fn();
  return User;
});

jest.mock("../lib/validators", () => ({
  validateSignupReq: jest.fn(),
  validateLoginReq: jest.fn(),
  validateGoogleLogin: jest.fn(),
  validateUpdateProfileReq: jest.fn(),
  validateChangePasswordReq: jest.fn(),
  validatePreferenceRequest: jest.fn(),
}));

jest.mock("../lib/google-auth", () => ({
  verifyGoogleCredential: jest.fn(),
}));

jest.mock("../lib/db", () => jest.fn());

const validators = require("../lib/validators");
const User = require("../models/User");
const {
  signup,
  login,
  updatePreference,
  changePassword,
} = require("../server/controllers/authController");

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validators.validateSignupReq.mockImplementation(() => true);
    validators.validateLoginReq.mockImplementation(() => true);
    validators.validatePreferenceRequest.mockImplementation(() => true);
    validators.validateChangePasswordReq.mockImplementation(() => true);
  });

  test("signup creates a new user", async () => {
    User.findOne.mockResolvedValue(null);

    const save = jest.fn();
    const hashPassword = jest.fn();
    User.mockImplementationOnce(() => ({
      save,
      hashPassword,
    }));

    const result = await signup({
      fullName: "Test User",
      email: "test@example.com",
      password: "Strong@123",
      baseCurrency: "INR",
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(hashPassword).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();
    expect(result.status).toBe(201);
  });

  test("login returns error for unknown user", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(
      login({ email: "test@example.com", password: "Strong@123" }),
    ).rejects.toThrow(/Invalid email or password/i);
  });

  test("updatePreference updates currency and theme", async () => {
    const save = jest.fn();
    User.findOne.mockResolvedValue({
      _id: "u1",
      baseCurrency: "INR",
      theme: "light",
      save,
      toObject: () => ({
        _id: "u1",
        baseCurrency: "USD",
        theme: "dark",
      }),
    });

    const result = await updatePreference(
      { _id: "u1" },
      { currency: "USD", theme: "dark" },
    );

    expect(save).toHaveBeenCalled();
    expect(result.status).toBe(200);
  });

  test("changePassword rejects invalid current password", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        comparePassword: jest.fn().mockResolvedValue(false),
      }),
    });

    await expect(
      changePassword(
        { _id: "u1" },
        { currentPassword: "Wrong@123", newPassword: "NewPass@1234" },
      ),
    ).rejects.toThrow(/Current password is incorrect/i);
  });
});
