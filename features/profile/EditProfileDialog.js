"use client";

import { Controller, useForm } from "react-hook-form";
import { Dialog, FormButton, FormInput } from "@/components";
import { useUpdateProfileMutation } from "@/features/auth/hooks";

export default function EditProfileDialog({ user, onClose }) {
  const { mutateAsync: updateProfile, isPending: isLoading } =
    useUpdateProfileMutation();
  const { control, formState, getValues } = useForm({
    mode: "all",
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  const handleSave = async () => {
    try {
      const values = getValues();
      await updateProfile(values);
      onClose?.();
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <Dialog
      open
      width="small"
      title="Edit Profile"
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
            Save
          </FormButton>
        </div>
      }
    >
      <div className="grid gap-4">
        <Controller
          name="fullName"
          control={control}
          rules={{ required: "Full name is required" }}
          render={({ field, fieldState }) => (
            <FormInput
              {...field}
              label="Full Name"
              placeholder="Enter full name"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          }}
          render={({ field, fieldState }) => (
            <FormInput
              {...field}
              type="email"
              label="Email"
              placeholder="Enter email"
              error={fieldState.error?.message}
            />
          )}
        />
      </div>
    </Dialog>
  );
}
