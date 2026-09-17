const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const connectDb = require("../lib/db");
const { resetCachedConnectionForTests } = require("../lib/db");
const User = require("../models/User");

jest.setTimeout(120_000);

let mongoServer;
let previousMongoUri;

async function startTestDatabase() {
  if (mongoServer) {
    return process.env.MONGO_URI;
  }

  previousMongoUri = process.env.MONGO_URI;
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGO_URI = mongoUri;
  resetCachedConnectionForTests();
  await connectDb();
  await User.syncIndexes();
  return mongoUri;
}

async function stopTestDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  resetCachedConnectionForTests();

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }

  if (previousMongoUri !== undefined) {
    process.env.MONGO_URI = previousMongoUri;
  } else {
    delete process.env.MONGO_URI;
  }
}

async function clearTestCollections() {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    return;
  }
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}

module.exports = {
  startTestDatabase,
  stopTestDatabase,
  clearTestCollections,
};
