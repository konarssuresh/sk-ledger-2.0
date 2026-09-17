const mongoose = require("mongoose");

const globalForMongoose = globalThis;

if (!globalForMongoose.__skLedgerMongoose) {
  globalForMongoose.__skLedgerMongoose = { conn: null, promise: null };
}

const cached = globalForMongoose.__skLedgerMongoose;

async function connectDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

function resetCachedConnectionForTests() {
  cached.conn = null;
  cached.promise = null;
}

module.exports = connectDb;
module.exports.resetCachedConnectionForTests = resetCachedConnectionForTests;
