"use client";

import { Controller, useForm } from "react-hook-form";
import { Dialog, FormButton, FormSelect } from "@/components";
import { useChangePreferencesMutation } from "@/features/auth/hooks";

const currencyOptions = [
  { label: "INR", value: "INR" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "JPY", value: "JPY" },
  { label: "CNY", value: "CNY" },
];

export default function UpdateCurrencyDialog({ user, onClose }) {
  const { mutateAsync: changePreferences, isPending: isLoading } =
    useChangePreferencesMutation();
  const { control, getValues } = useForm({
    defaultValues: {
      currency: user?.baseCurrency || "INR",
    },
  });

  const handleSave = async () => {
    try {
      const { currency } = getValues();
      await changePreferences({ currency });
      onClose?.();
    } catch (error) {
      console.error("Failed to update currency", error);
    }
  };

  return (
    <Dialog
      open
      width="small"
      title="Update Currency"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <FormButton variant="ghost" fullWidth={false} onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton fullWidth={false} loading={isLoading} onClick={handleSave}>
            Save
          </FormButton>
        </div>
      }
    >
      <Controller
        name="currency"
        control={control}
        render={({ field }) => (
          <FormSelect
            {...field}
            label="Base Currency"
            options={currencyOptions}
            helperText="Used as default currency for analytics and forms."
          />
        )}
      />
    </Dialog>
  );
}
