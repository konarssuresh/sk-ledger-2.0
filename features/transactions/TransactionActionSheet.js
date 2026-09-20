"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion as Motion } from "motion/react";
import { FormButton } from "@/components";
import { acquireBodyScrollLock } from "@/lib/bodyScrollLock";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

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

export default function TransactionActionSheet({
  transaction,
  category,
  displayDate,
  onClose,
  onEdit,
  onDelete,
}) {
  const panelRef = useRef(null);
  const lastFocusedRef = useRef(null);

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

  const dialogLabel = transaction?.name || "Transaction details";

  useEffect(() => {
    lastFocusedRef.current = document.activeElement;
    const releaseBodyScrollLock = acquireBodyScrollLock();

    const setInitialFocus = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusableElements = panel.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        panel.focus();
      }
    };

    const timer = window.setTimeout(setInitialFocus, 0);

    const onKeyDown = (event) => {
      if (!panelRef.current) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements =
        panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      releaseBodyScrollLock();
      document.removeEventListener("keydown", onKeyDown);
      if (
        lastFocusedRef.current &&
        typeof lastFocusedRef.current.focus === "function"
      ) {
        lastFocusedRef.current.focus();
      }
    };
  }, [onClose]);

  return createPortal(
    <Motion.div
      className="fixed inset-0 z-1100 flex items-end bg-slate-900/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <Motion.section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel}
        tabIndex={-1}
        className="w-full rounded-t-3xl border border-base-300 bg-base-100 px-4 pb-5 pt-4 shadow-2xl outline-none md:mx-auto md:mb-4 md:max-w-md md:rounded-2xl"
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
      </Motion.section>
    </Motion.div>,
    document.body,
  );
}
