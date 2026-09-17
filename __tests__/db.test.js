require("./mongoSetup");

const mongoose = require("mongoose");
const connectDb = require("../lib/db");

describe("connectDb", () => {
  test("reuses cached mongoose connection", async () => {
    const first = await connectDb();
    const second = await connectDb();

    expect(first).toBe(second);
    expect(mongoose.connection.readyState).toBe(1);
  });
});
