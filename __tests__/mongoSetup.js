/**
 * Import at the top of test suites that need an in-memory MongoDB.
 * Example: require("./mongoSetup");
 */
const {
  startTestDatabase,
  stopTestDatabase,
  clearTestCollections,
} = require("./test-db");

beforeAll(async () => {
  await startTestDatabase();
});

afterEach(async () => {
  await clearTestCollections();
});

afterAll(async () => {
  await stopTestDatabase();
});
