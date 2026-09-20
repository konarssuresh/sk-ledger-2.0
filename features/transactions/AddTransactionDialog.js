"use client";

import { useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Dialog,
  FormButton,
  FormInput,
  FormSelect,
  SegmentedTypeControl,
  TextArea,
} from "@/components";

import CalculatorDialog from "./CalculatorDialog";
import AddCategoryInlineDialog from "./AddCategoryInlineDialog";
import { mountDialog } from "./dialog-utils";
import { useCategoriesQuery } from "@/features/categories/hooks";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "@/features/transactions/hooks";
import { calendarSelectors } from "@/store/calendarSlice";

const { selectedDayKeySelector } = calendarSelectors;
const ADD_NEW_CATEGORY_VALUE = "__add_new_category__";
const DIVIDER_VALUE = "__divider__";

const getDefaultValues = ({ transaction = null, selectedDay } = {}) => {
  if (transaction) {
    return {
      id: transaction._id,
      name: transaction.name || "",
      type: transaction.type || "expense",
      amount: String(transaction.amount ?? ""),
      currency: transaction.currency || "INR",
      categoryId: transaction.categoryId || "",
      date: transaction?.date?.split?.("T")?.[0] || selectedDay,
      note: transaction.note || "",
    };
  }

  return {
    id: undefined,
    name: "",
    type: "expense",
    amount: "",
    currency: "INR",
    categoryId: "",
    date: selectedDay,
    note: "",
  };
};

function AddTransactionDialog({ onClose, transaction }) {
  const [saveError, setSaveError] = useState("");
  const selectedDay = useSelector(selectedDayKeySelector);
  const originalDate =
    transaction?.date?.split?.("T")?.[0] || transaction?.date || null;
  const { data: { categories = [] } = {}, isLoading: isFetchingCategories } =
    useCategoriesQuery();
  const {
    mutateAsync: addTransaction,
    isPending: isAddingTransaction,
  } = useCreateTransactionMutation();
  const {
    mutateAsync: updateTransaction,
    isPending: isUpdatingTransaction,
  } = useUpdateTransactionMutation();

  const defaultValues = useMemo(
    () => getDefaultValues({ transaction, selectedDay }),
    [transaction, selectedDay],
  );

  const { control, formState, setValue, getValues } = useForm({
    mode: "all",
    defaultValues,
  });

  const type = useWatch({ control, name: "type" });

  const handleOpenCalculator = () => {
    const currentAmount = getValues("amount");
    mountDialog((close) => (
      <CalculatorDialog
        value={currentAmount}
        onSelect={(selectedAmount) => {
          if (selectedAmount !== undefined) {
            setValue("amount", selectedAmount, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
          close();
        }}
        onClose={close}
      />
    ));
  };

  const handleOpenAddCategoryDialog = (selectedType) => {
    mountDialog((close) => (
      <AddCategoryInlineDialog
        defaultType={selectedType}
        onClose={close}
        onCreated={(category) => {
          if (!category?._id) return;
          setValue("categoryId", category._id, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue("type", category.type || selectedType, {
            shouldDirty: true,
            shouldValidate: true,
          });
          close();
        }}
      />
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = getValues();
    const { id, name, amount, currency, categoryId, date, type, note } = values;

    const reqBody = {
      name,
      amount: parseFloat(amount),
      currency,
      categoryId,
      date,
      type,
      note: note || "",
    };

    try {
      setSaveError("");
      if (id) {
        await updateTransaction({
          id,
          ...reqBody,
          previousDate: originalDate,
        });
      } else {
        await addTransaction(reqBody);
      }
      onClose();
    } catch (error) {
      setSaveError(
        error?.message || "Failed to save transaction. Please try again.",
      );
    }
  };

  return (
    <Dialog
      open
      title={transaction ? "Edit Transaction" : "Add Transaction"}
      width="large"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <FormButton
            variant="ghost"
            fullWidth={false}
            className="border border-slate-300/70 text-slate-700"
            onClick={onClose}
          >
            Cancel
          </FormButton>
          <FormButton
            fullWidth={false}
            onClick={handleSubmit}
            loading={isAddingTransaction || isUpdatingTransaction}
            disabled={
              !formState?.isValid ||
              isAddingTransaction ||
              isUpdatingTransaction
            }
            type="button"
          >
            {transaction ? "Update transaction" : "Save transaction"}
          </FormButton>
        </div>
      }
    >
      {saveError ? (
        <p className="mb-3 text-sm text-error" role="alert">
          {saveError}
        </p>
      ) : null}
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="md:col-span-2">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field, fieldState }) => {
              const { error, invalid } = fieldState;
              return (
                <FormInput
                  {...field}
                  error={invalid && error?.message}
                  type="text"
                  label="Title"
                  placeholder="e.g. Grocery shopping"
                />
              );
            }}
          />
        </div>

        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-slate-700">Type</p>
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              const { value, onChange } = field;
              return (
                <SegmentedTypeControl
                  value={value}
                  onChange={(newType) => {
                    onChange(newType);
                    setValue("categoryId", "", { shouldDirty: true });
                  }}
                  options={[
                    { id: "income", label: "Income" },
                    { id: "expense", label: "Expense" },
                    { id: "savings", label: "Savings" },
                  ]}
                />
              );
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="amount"
            control={control}
            rules={{
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be at least 0.01" },
            }}
            render={({ field, fieldState }) => {
              const { error, invalid } = fieldState;

              return (
                <FormInput
                  {...field}
                  error={invalid && error?.message}
                  type="number"
                  label="Amount"
                  placeholder="0.00"
                />
              );
            }}
          />
          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenCalculator}
              className="btn btn-outline btn-square h-11 w-11 rounded-xl border-teal-300 text-teal-700 hover:bg-teal-50"
              aria-label="Open calculator"
              title="Open calculator"
            >
              🧮
            </button>
          </div>
        </div>

        <Controller
          name="currency"
          control={control}
          render={({ field, fieldState }) => {
            const { error, invalid } = fieldState;
            return (
              <FormSelect
                {...field}
                error={invalid && error?.message}
                label="Currency"
                defaultValue="INR"
                options={[
                  { label: "INR", value: "INR" },
                  { label: "USD", value: "USD" },
                  { label: "EUR", value: "EUR" },
                ]}
              />
            );
          }}
        />

        <Controller
          name="categoryId"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field, fieldState }) => {
            const { error, invalid } = fieldState;

            const options = categories
              .filter((category) => category.type === type)
              .map((category) => ({
              label: `${category.emoji} ${category.name}`,
              value: category._id,
            }));

            return (
              <FormSelect
                {...field}
                onChange={(event) => {
                  const { value } = event.target;
                  if (value === ADD_NEW_CATEGORY_VALUE) {
                    handleOpenAddCategoryDialog(type);
                    return;
                  }
                  field.onChange(event);
                }}
                loading={isFetchingCategories}
                error={invalid && error?.message}
                label="Category"
                options={[
                  { label: "Select category", value: "", disabled: true },
                  ...options,
                  {
                    label: "────────────",
                    value: DIVIDER_VALUE,
                    disabled: true,
                  },
                  {
                    label: "+ Add new category",
                    value: ADD_NEW_CATEGORY_VALUE,
                  },
                ]}
              />
            );
          }}
        />

        <Controller
          name="date"
          control={control}
          rules={{ required: "Date is required" }}
          render={({ field, fieldState }) => {
            const { error, invalid } = fieldState;
            return (
              <FormInput
                {...field}
                error={invalid && error?.message}
                type="date"
                label="Date"
              />
            );
          }}
        />

        <div className="md:col-span-2">
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                type="text"
                label="Note (optional)"
                placeholder="Add a short note"
                minRows={3}
              />
            )}
          />
        </div>
      </form>
    </Dialog>
  );
}

export default AddTransactionDialog;
