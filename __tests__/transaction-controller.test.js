jest.mock("../models/Transaction", () => {
  const Transaction = jest.fn();
  Transaction.find = jest.fn();
  Transaction.findOne = jest.fn();
  return Transaction;
});

jest.mock("../lib/validators", () => ({
  validateCreateTransactionReq: jest.fn(),
  validateUpdateTransactionReq: jest.fn(),
}));

jest.mock("../lib/db", () => jest.fn());

const Transaction = require("../models/Transaction");
const validators = require("../lib/validators");
const {
  createTransaction,
  getTransactions,
  getMonthlyTransactionSummary,
  updateTransaction,
  deleteTransaction,
} = require("../server/controllers/transactionController");

describe("transactionController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validators.validateCreateTransactionReq.mockImplementation(() => true);
    validators.validateUpdateTransactionReq.mockImplementation(() => true);
  });

  test("createTransaction creates new transaction", async () => {
    const save = jest.fn();
    Transaction.mockImplementationOnce(() => ({ save }));

    const result = await createTransaction(
      { _id: "u1" },
      {
        name: "Milk",
        amount: 56,
        currency: "INR",
        categoryId: "507f191e810c19729de860ea",
        date: "2026-02-12T00:00:00.000Z",
        type: "expense",
      },
    );

    expect(save).toHaveBeenCalled();
    expect(result.status).toBe(201);
  });

  test("getTransactions validates query date", async () => {
    await expect(
      getTransactions({ _id: "u1" }, { date: "invalid-date" }),
    ).rejects.toThrow(/Invalid date query param/i);
  });

  test("monthly summary returns grouped response for month", async () => {
    Transaction.find.mockReturnValue({
      lean: async () => [
        { date: "2026-02-01T10:00:00.000Z", amount: 1000, type: "income" },
        { date: "2026-02-01T11:00:00.000Z", amount: 100, type: "expense" },
      ],
    });

    const result = await getMonthlyTransactionSummary(
      { _id: "u1" },
      { year: "2026", month: "2" },
    );

    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      "2026-02-01": { income: 1000, expense: 100, savings: 0 },
    });
  });

  test("updateTransaction returns 404 when not found", async () => {
    Transaction.findOne.mockResolvedValue(null);
    await expect(
      updateTransaction({ _id: "u1" }, "t1", {}),
    ).rejects.toThrow(/Transaction not found/i);
  });

  test("updateTransaction applies zero amount", async () => {
    const save = jest.fn();
    Transaction.findOne.mockResolvedValue({
      amount: 10,
      save,
    });

    const result = await updateTransaction({ _id: "u1" }, "t1", { amount: 0 });
    expect(save).toHaveBeenCalled();
    expect(result.status).toBe(200);
  });

  test("deleteTransaction returns 404 when not found", async () => {
    Transaction.findOne.mockResolvedValue(null);
    await expect(deleteTransaction({ _id: "u1" }, "t1")).rejects.toThrow(
      /Transaction not found/i,
    );
  });
});
