require("./mongoSetup");

const User = require("../models/User");
const { createUser, createGoogleUser } = require("./helpers");

describe("User Google identity", () => {
  test("creates a Google-only user without a password", async () => {
    const user = await createGoogleUser({
      googleSubjectId: "google-subject-1",
    });

    const stored = await User.findById(user._id);
    expect(stored.googleSubjectId).toBe("google-subject-1");
    expect(stored.password).toBeUndefined();

    const withPassword = await User.findById(user._id).select("+password");
    expect(withPassword.password).toBeFalsy();
  });

  test("rejects duplicate googleSubjectId", async () => {
    await createGoogleUser({ googleSubjectId: "duplicate-subject" });

    await expect(
      createGoogleUser({
        googleSubjectId: "duplicate-subject",
        email: "other@example.com",
      }),
    ).rejects.toThrow(/duplicate key/i);
  });

  test("email/password users still hash passwords", async () => {
    const user = await createUser({ password: "Pass@1234" });
    const withPassword = await User.findById(user._id).select("+password");

    expect(withPassword.password).toBeTruthy();
    expect(withPassword.password).not.toBe("Pass@1234");
    const matches = await withPassword.comparePassword("Pass@1234");
    expect(matches).toBe(true);
  });
});
