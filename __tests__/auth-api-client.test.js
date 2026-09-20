const {
  updateProfileRequest,
  changePreferencesRequest,
  changePasswordRequest,
  signoutRequest,
  meRequest,
} = require("../features/auth/api");

describe("auth api client", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("meRequest calls GET /api/auth/me", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ user: { id: "1" } }),
    });

    await meRequest();

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });
  });

  test("updateProfileRequest calls PATCH /api/auth/profile", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ message: "ok" }),
    });

    await updateProfileRequest({ fullName: "Test" });

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/profile", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Test" }),
    });
  });

  test("changePreferencesRequest calls POST /api/auth/changePreferences", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ theme: "dark" }),
    });

    await changePreferencesRequest({ theme: "dark", currency: "USD" });

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/changePreferences", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: "dark", currency: "USD" }),
    });
  });

  test("changePasswordRequest calls POST /api/auth/change-password", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ message: "Password changed successfully" }),
    });

    await changePasswordRequest({
      currentPassword: "old",
      newPassword: "new",
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/change-password", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: "old", newPassword: "new" }),
    });
  });

  test("signoutRequest calls POST /api/auth/signout", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ message: "Logout successful" }),
    });

    await signoutRequest();

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/signout", {
      method: "POST",
      credentials: "include",
    });
  });
});
