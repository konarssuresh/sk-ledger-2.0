const connectDb = require("../../lib/db");
const Transaction = require("../../models/Transaction");
const { AppError, NotFoundError } = require("../../lib/errors");
const {
  validateCreateTransactionReq,
  validateUpdateTransactionReq,
} = require("../../lib/validators");

async function createTransaction(user, body) {
  await connectDb();
  validateCreateTransactionReq({ body });
  const {
    name,
    amount,
    currency,
    categoryId,
    date,
    type,
    note = "",
  } = body;

  const transaction = new Transaction({
    name,
    amount,
    currency,
    categoryId,
    date,
    type,
    userId: user._id,
    note,
  });

  await transaction.save();
  return {
    status: 201,
    body: { message: "Transaction created successfully", transaction },
  };
}

async function updateTransaction(user, id, body) {
  await connectDb();
  validateUpdateTransactionReq({ body });
  const { name, amount, currency, categoryId, date, type, note } = body;

  const transaction = await Transaction.findOne({
    _id: id,
    userId: user._id,
  });
  if (!transaction) {
    throw new NotFoundError("Transaction not found");
  }

  if (name !== undefined) transaction.name = name;
  if (amount !== undefined) transaction.amount = amount;
  if (currency !== undefined) transaction.currency = currency;
  if (categoryId !== undefined) transaction.categoryId = categoryId;
  if (date !== undefined) transaction.date = date;
  if (type !== undefined) transaction.type = type;
  if (note !== undefined) transaction.note = note;

  await transaction.save();
  return {
    status: 200,
    body: { message: "Transaction updated successfully", transaction },
  };
}

async function deleteTransaction(user, id) {
  await connectDb();
  const transaction = await Transaction.findOne({
    _id: id,
    userId: user._id,
  });
  if (!transaction) {
    throw new NotFoundError("Transaction not found");
  }

  await transaction.deleteOne();
  return { status: 200, body: { message: "Transaction deleted successfully" } };
}

async function getTransactions(user, query = {}) {
  await connectDb();
  const { date } = query;
  const filter = { userId: user._id };

  if (date) {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      throw new AppError("Invalid date query param. Use YYYY-MM-DD.");
    }

    const start = new Date(parsed);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(parsed);
    end.setUTCHours(23, 59, 59, 999);

    filter.date = { $gte: start, $lte: end };
  }

  const transactions = await Transaction.find(filter).lean();
  return { status: 200, body: { transactions } };
}

async function getMonthlyTransactionSummary(user, query = {}) {
  await connectDb();
  const { year, month } = query;

  if (!year || !month) {
    const transactions = await Transaction.find({
      userId: user._id,
    }).lean();
    return { status: 200, body: { transactions } };
  }

  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (
    !Number.isInteger(parsedYear) ||
    parsedYear < 1970 ||
    !Number.isInteger(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    throw new AppError("year and month query params are invalid");
  }

  const startDate = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
  const endDate = new Date(Date.UTC(parsedYear, parsedMonth, 1));

  const transactions = await Transaction.find({
    userId: user._id,
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  }).lean();

  const summary = {};

  transactions.forEach((transaction) => {
    const txDate = new Date(transaction.date);
    const yyyy = txDate.getUTCFullYear();
    const mm = String(txDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(txDate.getUTCDate()).padStart(2, "0");
    const dayKey = `${yyyy}-${mm}-${dd}`;

    if (!summary[dayKey]) {
      summary[dayKey] = { income: 0, expense: 0, savings: 0 };
    }

    const amount = Number(transaction.amount || 0);
    if (transaction.type === "income") {
      summary[dayKey].income += amount;
    } else if (transaction.type === "expense") {
      summary[dayKey].expense += amount;
    } else if (transaction.type === "savings") {
      summary[dayKey].savings += amount;
    }
  });

  return { status: 200, body: summary };
}

async function getTransactionById(user, id) {
  await connectDb();
  const transaction = await Transaction.findOne({
    _id: id,
    userId: user._id,
  }).lean();

  if (!transaction) {
    throw new NotFoundError("Transaction not found");
  }

  return { status: 200, body: { transaction } };
}

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getMonthlyTransactionSummary,
  getTransactionById,
};
