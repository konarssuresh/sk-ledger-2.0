const connectDb = require("../db");

async function findOwnedDocument(Model, { _id, userId }) {
  await connectDb();
  return Model.findOne({ _id, userId });
}

module.exports = {
  findOwnedDocument,
};
