require("./mongoSetup");

const { invokeRoute } = require("./helpers/route-test");
const { createUser, authCookieForUser } = require("./helpers");
const { POST: signupPost } = require("../app/api/auth/signup/route");
const { POST: loginPost } = require("../app/api/auth/login/route");
const { POST: googlePost } = require("../app/api/auth/login/google/route");
const { POST: signoutPost } = require("../app/api/auth/signout/route");
const { GET: meGet } = require("../app/api/auth/me/route");
const { POST: changePreferencesPost } = require("../app/api/auth/changePreferences/route");
const { PATCH: profilePatch } = require("../app/api/auth/profile/route");
const { POST: changePasswordPost } = require("../app/api/auth/change-password/route");

jest.mock("../lib/google-auth", () => ({
  verifyGoogleCredential: jest.fn(),
}));

const { verifyGoogleCredential } = require("../lib/google-auth");

describe("auth Route Handlers", () => {
  test("POST /api/auth/signup registers user", async () => {
    const res = await invokeRoute(signupPost, {
      method: "POST",
      url: "http://localhost:3000/api/auth/signup",
      body: {
        fullName: "Signup User",
        email: "signup@test.com",
        password: "Strong@123",
        baseCurrency: "INR",
      },
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/registered successfully/i);
  });

  test("POST /api/auth/login authenticates and sets cookie", async () => {
    await createUser({ email: "login@test.com", password: "Pass@1234" });
    const res = await invokeRoute(loginPost, {
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: {
        email: "login@test.com",
        password: "Pass@1234",
      },
    });

    expect(res.status).toBe(200);
    expect(res.cookies.length).toBeGreaterThan(0);
  });

  test("POST /api/auth/login/google rejects invalid payload", async () => {
    const res = await invokeRoute(googlePost, {
      method: "POST",
      url: "http://localhost:3000/api/auth/login/google",
      body: {},
    });
    expect(res.status).toBe(400);
  });

  test("GET /api/auth/me returns unauthorized without cookie", async () => {
    const res = await invokeRoute(meGet, {
      method: "GET",
      url: "http://localhost:3000/api/auth/me",
    });
    expect(res.status).toBe(401);
  });

  test("GET /api/auth/me returns current user with cookie", async () => {
    const user = await createUser({ email: "me@test.com" });
    const res = await invokeRoute(meGet, {
      method: "GET",
      url: "http://localhost:3000/api/auth/me",
      cookies: authCookieForUser(user),
    });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("me@test.com");
  });

  test("POST /api/auth/changePreferences updates theme/currency", async () => {
    const user = await createUser({ email: "pref@test.com" });
    const res = await invokeRoute(changePreferencesPost, {
      method: "POST",
      url: "http://localhost:3000/api/auth/changePreferences",
      cookies: authCookieForUser(user),
      body: { currency: "USD", theme: "dark" },
    });

    expect(res.status).toBe(200);
    expect(res.body.baseCurrency).toBe("USD");
    expect(res.body.theme).toBe("dark");
  });

  test("PATCH /api/auth/profile updates fullName", async () => {
    const user = await createUser({ email: "profile@test.com" });
    const res = await invokeRoute(profilePatch, {
      method: "PATCH",
      url: "http://localhost:3000/api/auth/profile",
      cookies: authCookieForUser(user),
      body: { fullName: "Updated Name" },
    });

    expect(res.status).toBe(200);
    expect(res.body.user.fullName).toBe("Updated Name");
  });

  test("POST /api/auth/change-password changes password", async () => {
    const user = await createUser({
      email: "password@test.com",
      password: "Pass@1234",
    });
    const res = await invokeRoute(changePasswordPost, {
      method: "POST",
      url: "http://localhost:3000/api/auth/change-password",
      cookies: authCookieForUser(user),
      body: { currentPassword: "Pass@1234", newPassword: "NewPass@1234" },
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/changed successfully/i);
  });

  test("POST /api/auth/signout clears token cookie", async () => {
    const res = await invokeRoute(signoutPost, {
      method: "POST",
      url: "http://localhost:3000/api/auth/signout",
    });
    expect(res.status).toBe(200);
    expect(res.cookies.length).toBeGreaterThan(0);
  });

  test("POST /api/auth/login/google creates user and sets cookie", async () => {
    verifyGoogleCredential.mockResolvedValue({
      sub: "google-sub-new",
      email: "newgoogle@test.com",
      email_verified: true,
      name: "Google New",
    });

    const res = await invokeRoute(googlePost, {
      method: "POST",
      url: "http://localhost:3000/api/auth/login/google",
      body: { credential: "fake-token" },
    });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("newgoogle@test.com");
    expect(res.cookies.length).toBeGreaterThan(0);
  });
});
