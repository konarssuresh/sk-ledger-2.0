require("./mongoSetup");

const User = require("../models/User");
const { resolveUserForGoogleLogin } = require("../server/services/google-account");
const { createUser } = require("./helpers");

describe("Google account policy", () => {
  test("creates a Google-only user for first verified login", async () => {
    const user = await resolveUserForGoogleLogin({
      sub: "google-create-1",
      email: "create-google@test.com",
      email_verified: true,
      name: "Create Google",
    });

    expect(user.googleSubjectId).toBe("google-create-1");
    expect(user.email).toBe("create-google@test.com");
  });

  test("links Google subject to existing password account by email", async () => {
    await createUser({ email: "link@test.com", password: "Pass@1234" });

    const linked = await resolveUserForGoogleLogin({
      sub: "google-link-1",
      email: "link@test.com",
      email_verified: true,
      name: "Link User",
    });

    expect(linked.googleSubjectId).toBe("google-link-1");
    const stored = await User.findOne({ email: "link@test.com" });
    expect(stored.googleSubjectId).toBe("google-link-1");
  });

  test("returns the same user when Google subject already exists", async () => {
    const first = await resolveUserForGoogleLogin({
      sub: "google-dup-sub",
      email: "first-google@test.com",
      email_verified: true,
      name: "First",
    });

    const second = await resolveUserForGoogleLogin({
      sub: "google-dup-sub",
      email: "other-email@test.com",
      email_verified: true,
      name: "Second",
    });

    expect(String(second._id)).toBe(String(first._id));
  });

  test("rejects linking a new Google subject to an account that already has one", async () => {
    const user = await createUser({ email: "conflict@test.com", password: "Pass@1234" });
    user.googleSubjectId = "existing-google-sub";
    await user.save();

    await expect(
      resolveUserForGoogleLogin({
        sub: "different-google-sub",
        email: "conflict@test.com",
        email_verified: true,
        name: "Conflict",
      }),
    ).rejects.toThrow(/already linked/i);
  });

  test("rejects unverified Google email", async () => {
    await expect(
      resolveUserForGoogleLogin({
        sub: "google-unverified",
        email: "unverified@test.com",
        email_verified: false,
        name: "Unverified",
      }),
    ).rejects.toThrow(/not verified/i);
  });
});
