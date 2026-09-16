/**
 * In-memory MongoDB hooks for ported API/controller tests (Phase 1+).
 * Import this file at the top of a test suite, or add it to Jest setupFilesAfterEnv
 * when Route Handler contract tests are migrated from skledger-server.
 */
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.setTimeout(120_000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 120_000);

afterEach(async () => {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    return;
  }
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 120_000);
