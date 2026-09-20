"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "motion/react";
import { mountDialog } from "./dialog-utils";
import AddTransactionDialog from "./AddTransactionDialog";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import TransactionActionSheet from "./TransactionActionSheet";
import { useCategoriesQuery } from "@/features/categories/hooks";
import { useDayTransactionsQuery } from "@/features/transactions/hooks";
import { calendarSelectors } from "@/store/calendarSlice";
import {
  closeTransactionActionSheet,
  openTransactionActionSheet,
  transactionUiSelectors,
} from "@/store/transactionUiSlice";

const { selectedDayKeySelector } = calendarSelectors;
const { selectedTransactionIdSelector, isActionSheetOpenSelector } =
  transactionUiSelectors;

const amountClassByType = {
  income: "text-success",
  expense: "text-error",
  savings: "text-info",
};

const signByType = {
  income: "+",
  expense: "-",
  savings: "-",
};

const toTitleCase = (value = "") =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";

const formatAmount = (amount, currency = "INR") => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  } catch {
    return `${currency} ${Number(amount || 0)}`;
  }
};

const formatDateLabel = (dateKey) => {
  if (!dateKey) return "";
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DayTransactions = () => {
  const dispatch = useDispatch();
  const selectedDay = useSelector(selectedDayKeySelector);
  const selectedTransactionId = useSelector(selectedTransactionIdSelector);
  const isActionSheetOpen = useSelector(isActionSheetOpenSelector);
  const { data: { categories = [] } = {}, isLoading: isLoadingCategories } =
    useCategoriesQuery();

  const { data: { transactions = [] } = {}, isLoading: isLoadingTransactions } =
    useDayTransactionsQuery(selectedDay);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[String(category._id)] = category;
      return acc;
    }, {});
  }, [categories]);

  const displayDate = useMemo(
    () => formatDateLabel(selectedDay),
    [selectedDay],
  );

  const selectedTransaction = useMemo(() => {
    if (!selectedTransactionId) return null;
    return transactions.find(
      (t) => String(t._id) === String(selectedTransactionId),
    );
  }, [transactions, selectedTransactionId]);

  useEffect(() => {
    if (isActionSheetOpen && selectedTransactionId && !selectedTransaction) {
      dispatch(closeTransactionActionSheet());
    }
  }, [
    dispatch,
    isActionSheetOpen,
    selectedTransaction,
    selectedTransactionId,
  ]);

  const isLoading = isLoadingCategories || isLoadingTransactions;

  const handleOpenRow = (transaction) => {
    dispatch(openTransactionActionSheet(transaction._id));
  };

  const handleCloseSheet = () => {
    dispatch(closeTransactionActionSheet());
  };

  const openEditDialog = (transaction) => {
    mountDialog((close) => (
      <AddTransactionDialog transaction={transaction} onClose={close} />
    ));
  };

  const openDeleteConfirm = (transaction) => {
    mountDialog((close) => (
      <DeleteTransactionDialog transaction={transaction} onClose={close} />
    ));
  };

  const handleEdit = () => {
    if (!selectedTransaction) return;
    const transaction = selectedTransaction;
    handleCloseSheet();
    openEditDialog(transaction);
  };

  const handleDelete = () => {
    if (!selectedTransaction) return;
    const transaction = selectedTransaction;
    handleCloseSheet();
    openDeleteConfirm(transaction);
  };

  return (
    <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-2.5 md:mt-5 md:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-base-content">
          {displayDate}
        </h2>
      </div>
      <div className="grid gap-2">
        {isLoading ? (
          <div className="rounded-xl border border-base-300 bg-base-200/40 px-3 py-4 text-sm text-base-content/60">
            Loading transactions...
          </div>
        ) : null}

        {!isLoading && transactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-base-300 bg-base-200/40 px-3 py-4 text-sm text-base-content/60">
            No transactions for selected day.
          </div>
        ) : null}

        {!isLoading
          ? transactions.map((transaction) => {
              const category = categoryMap[String(transaction.categoryId)];
              const amountClass =
                amountClassByType[transaction.type] || "text-base-content";
              const sign = signByType[transaction.type] || "";
              return (
                <button
                  key={transaction._id}
                  type="button"
                  onClick={() => handleOpenRow(transaction)}
                  className="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-left transition hover:border-primary/40"
                >
                  <div>
                    <div className="text-sm font-semibold text-base-content">
                      {transaction.name}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {category?.emoji ? `${category.emoji} ` : ""}
                      {category?.name || "Unknown category"} ·{" "}
                      {toTitleCase(transaction.type)}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${amountClass}`}>
                    {sign}{" "}
                    {formatAmount(transaction.amount, transaction.currency)}
                  </div>
                </button>
              );
            })
          : null}
      </div>

      <AnimatePresence>
        {isActionSheetOpen && selectedTransaction ? (
          <TransactionActionSheet
            transaction={selectedTransaction}
            category={categoryMap[String(selectedTransaction.categoryId)]}
            displayDate={displayDate}
            onClose={handleCloseSheet}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default DayTransactions;
