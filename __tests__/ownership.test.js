require("./mongoSetup");

const Transaction = require("../models/Transaction");
const { findOwnedDocument } = require("../lib/auth/ownership");
const {
  createUser,
  createCategory,
  createTransaction,
} = require("./helpers");

describe("findOwnedDocument", () => {
  test("returns document for owning user", async () => {
    const owner = await createUser();
    const category = await createCategory(owner);
    const transaction = await createTransaction(owner, category);

    const found = await findOwnedDocument(Transaction, {
      _id: transaction._id,
      userId: owner._id,
    });

    expect(found).not.toBeNull();
    expect(String(found._id)).toBe(String(transaction._id));
  });

  test("returns null for another user", async () => {
    const owner = await createUser();
    const other = await createUser();
    const category = await createCategory(owner);
    const transaction = await createTransaction(owner, category);

    const found = await findOwnedDocument(Transaction, {
      _id: transaction._id,
      userId: other._id,
    });

    expect(found).toBeNull();
  });
});
