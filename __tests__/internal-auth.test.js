const { requireInternalKey } = require("../lib/auth/require-internal-key");
const { ForbiddenError } = require("../lib/errors");

describe("requireInternalKey", () => {
  beforeEach(() => {
    process.env.INTERNAL_KEY = "test-internal-key";
  });

  test("throws when key is missing", () => {
    const request = { headers: new Headers() };
    expect(() => requireInternalKey(request)).toThrow(ForbiddenError);
  });

  test("throws when key is invalid", () => {
    const request = {
      headers: new Headers({ "x-internal-key": "wrong-key" }),
    };
    expect(() => requireInternalKey(request)).toThrow(ForbiddenError);
  });

  test("passes for valid key", () => {
    const request = {
      headers: new Headers({ "x-internal-key": "test-internal-key" }),
    };
    expect(() => requireInternalKey(request)).not.toThrow();
  });
});
