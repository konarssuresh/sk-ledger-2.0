"use client";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, FormButton, FormSelect } from "@/components";
import { useChangePreferencesMutation } from "@/features/auth/hooks";
import { setTheme, themeSelector } from "@/store/userPreferenceSlice";

const themeOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export default function SwitchThemeDialog({ user, onClose }) {
  const dispatch = useDispatch();
  const currentTheme = useSelector(themeSelector);
  const { mutateAsync: changePreferences, isPending: isLoading } =
    useChangePreferencesMutation();
  const { control, getValues } = useForm({
    defaultValues: {
      theme: user?.theme || currentTheme || "light",
    },
  });

  const handleSave = async () => {
    const { theme } = getValues();
    const previousTheme = currentTheme;
    dispatch(setTheme(theme));
    try {
      await changePreferences({ theme });
      onClose?.();
    } catch (error) {
      dispatch(setTheme(previousTheme));
      console.error("Failed to switch theme", error);
    }
  };

  return (
    <Dialog
      open
      width="small"
      title="Switch Theme"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <FormButton variant="ghost" fullWidth={false} onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton fullWidth={false} loading={isLoading} onClick={handleSave}>
            Apply
          </FormButton>
        </div>
      }
    >
      <Controller
        name="theme"
        control={control}
        render={({ field }) => (
          <FormSelect
            {...field}
            label="Theme"
            options={themeOptions}
            helperText="Applies to app screens immediately."
          />
        )}
      />
    </Dialog>
  );
}
