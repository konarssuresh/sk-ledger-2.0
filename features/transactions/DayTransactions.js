"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion as Motion } from "motion/react";
import { FormButton } from "@/components";
import { mountDialog } from "./dialog-utils";
import AddTransactionDialog from "./AddTransactionDialog";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import { useCategoriesQuery } from "@/features/categories/hooks";
import { useDayTransactionsQuery } from "@/features/transactions/hooks";
import { calendarSelectors } from "@/store/calendarSlice";

const { selectedDayKeySelector } = calendarSelectors;

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

const TransactionActionSheet = ({
  transaction,
  category,
  displayDate,
  onClose,
  onEdit,
  onDelete,
}) => {
  const amountClass =
    amountClassByType[transaction?.type] || "text-base-content";
  const sign = signByType[transaction?.type] || "";
  const transactionDate = formatDateLabel(
    transaction?.date?.split?.("T")?.[0] || "",
  );
  const createdAt = transaction?.createdAt
    ? new Date(transaction.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return createPortal(
    <Motion.div
      className="fixed inset-0 z-1100 flex items-end bg-slate-900/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Motion.div
        className="w-full rounded-t-3xl border border-base-300 bg-base-100 px-4 pb-5 pt-4 shadow-2xl md:mx-auto md:mb-4 md:max-w-md md:rounded-2xl"
        initial={{ y: "100%", opacity: 0.95 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 32,
          mass: 0.8,
        }}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-base-300" />
        <div className="text-sm font-semibold text-base-content">
          {displayDate}
        </div>

        <div className="mt-3 rounded-xl border border-base-300 bg-base-100 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-base font-semibold text-base-content">
              {transaction.name}
            </div>
            <div className="rounded-full border border-base-300 px-2 py-0.5 text-[11px] font-medium text-base-content/70">
              {toTitleCase(transaction.type)}
            </div>
          </div>
          <div className="text-sm text-base-content/65">
            {category?.emoji ? `${category.emoji} ` : ""}
            {category?.name || "Unknown category"}
          </div>
          <div className={`mt-2 text-lg font-bold ${amountClass}`}>
            {sign} {formatAmount(transaction.amount, transaction.currency)}
          </div>
          <div className="mt-3 grid gap-1.5 text-xs text-base-content/70">
            <div>
              <span className="font-medium text-base-content/80">Date:</span>{" "}
              {transactionDate || displayDate}
            </div>
            <div>
              <span className="font-medium text-base-content/80">
                Currency:
              </span>
              {transaction.currency || "INR"}
            </div>
            <div>
              <span className="font-medium text-base-content/80">Created:</span>{" "}
              {createdAt}
            </div>
            {transaction.note ? (
              <div>
                <span className="font-medium text-base-content/80">Note:</span>{" "}
                {transaction.note}
              </div>
            ) : null}
          </div>
        </div>

        <div className="my-4 h-px bg-base-300" />

        <div className="grid gap-2">
          <FormButton type="button" variant="outline" onClick={onEdit}>
            Edit
          </FormButton>
          <FormButton
            type="button"
            className="border-red-200 bg-red-500 text-white hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </FormButton>
        </div>
      </Motion.div>
    </Motion.div>,
    document.body,
  );
};

const DayTransactions = () => {
  const selectedDay = useSelector(selectedDayKeySelector);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { data: { categories = [] } = {}, isLoading: isLoadingCategories } =
    useCategoriesQuery(undefined, {
      refetchOnReconnect: true,
    });

  const { data: { transactions = [] } = {}, isLoading: isLoadingTransactions } =
    useDayTransactionsQuery({
      date: selectedDay,
    });

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

  const isLoading = isLoadingCategories || isLoadingTransactions;

  const openEditDialog = (transaction) => {
    mountDialog((close) => (
      <AddTransactionDialog transaction={transaction} onClose={close} />
    ));
  };

  const openDeleteConfirm = (transaction) => {
    mountDialog((close) => (
      <DeleteTransactionDialog
        transaction={transaction}
        onClose={close}
        onDeleted={() => setSelectedTransaction(null)}
      />
    ));
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
                  onClick={() => setSelectedTransaction(transaction)}
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
        {selectedTransaction ? (
          <TransactionActionSheet
            transaction={selectedTransaction}
            category={categoryMap[String(selectedTransaction.categoryId)]}
            displayDate={displayDate}
            onClose={() => setSelectedTransaction(null)}
            onEdit={() => {
              openEditDialog(selectedTransaction);
              setSelectedTransaction(null);
            }}
            onDelete={() => {
              setSelectedTransaction(null);
              openDeleteConfirm(selectedTransaction);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default DayTransactions;
