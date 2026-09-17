require("./mongoSetup");

const { UnauthorizedError } = require("../lib/errors");
const { resolveUserFromToken } = require("../lib/auth/require-current-user");
const { toPublicUser } = require("../lib/auth/public-user");
const { createUser, authTokenForUser } = require("./helpers");

describe("resolveUserFromToken", () => {
  test("throws when token is missing", async () => {
    await expect(resolveUserFromToken(undefined)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  test("throws when token is invalid", async () => {
    await expect(resolveUserFromToken("bad-token")).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  test("returns user when token is valid", async () => {
    const user = await createUser();
    const token = authTokenForUser(user);
    const resolved = await resolveUserFromToken(token);

    expect(String(resolved._id)).toBe(String(user._id));
  });
});

describe("toPublicUser", () => {
  test("omits password from public user shape", async () => {
    const user = await createUser();
    const publicUser = toPublicUser(user);

    expect(publicUser.password).toBeUndefined();
    expect(publicUser.email).toBe(user.email);
    expect(publicUser.fullName).toBe(user.fullName);
    expect(String(publicUser.id)).toBe(String(user._id));
  });
});
