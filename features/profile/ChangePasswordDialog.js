"use client";

import { Controller, useForm } from "react-hook-form";
import { Dialog, FormButton, FormInput } from "@/components";
import { useChangePasswordMutation } from "@/features/auth/hooks";

export default function ChangePasswordDialog({ onClose }) {
  const { mutateAsync: changePassword, isPending: isLoading } =
    useChangePasswordMutation();
  const { control, formState, getValues } = useForm({
    mode: "all",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const handleSave = async () => {
    try {
      const values = getValues();
      await changePassword(values);
      onClose?.();
    } catch (error) {
      console.error("Failed to change password", error);
    }
  };

  return (
    <Dialog
      open
      width="small"
      title="Change Password"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <FormButton variant="ghost" fullWidth={false} onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton
            fullWidth={false}
            loading={isLoading}
            disabled={!formState.isValid}
            onClick={handleSave}
          >
            Update
          </FormButton>
        </div>
      }
    >
      <div className="grid gap-4">
        <Controller
          name="currentPassword"
          control={control}
          rules={{ required: "Current password is required" }}
          render={({ field, fieldState }) => (
            <FormInput
              {...field}
              type="password"
              label="Current Password"
              placeholder="Current password"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          rules={{
            required: "New password is required",
            minLength: {
              value: 8,
              message: "Must be at least 8 characters",
            },
          }}
          render={({ field, fieldState }) => (
            <FormInput
              {...field}
              type="password"
              label="New Password"
              placeholder="New password"
              helperText="Use uppercase, lowercase, number and symbol."
              error={fieldState.error?.message}
            />
          )}
        />
      </div>
    </Dialog>
  );
}
