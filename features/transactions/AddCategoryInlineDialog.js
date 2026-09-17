"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  FormButton,
  FormInput,
  SegmentedTypeControl,
} from "@/components";
import { useCreateCategoryMutation } from "@/features/categories/hooks";

const CURATED_EMOJIS = [
  "🍛",
  "🍔",
  "🍕",
  "🍜",
  "☕",
  "🍺",
  "🛒",
  "🛍️",
  "🧴",
  "🚗",
  "🛵",
  "🚕",
  "🚆",
  "✈️",
  "⛽",
  "🏠",
  "💡",
  "💧",
  "📡",
  "📺",
  "💳",
  "🧾",
  "🏦",
  "🎬",
  "🎮",
  "🎵",
  "🧘",
  "🏋️",
  "🏏",
  "👕",
  "👟",
  "📱",
  "🏥",
  "💊",
  "🎁",
  "👶",
  "🐶",
  "💼",
  "🧑‍💻",
  "📈",
  "💰",
  "🎯",
  "🪙",
];

const AddCategoryInlineDialog = ({ onClose, defaultType = "expense", onCreated }) => {
  const { mutateAsync: createCategory, isPending: isLoading } =
    useCreateCategoryMutation();

  const { control, formState, getValues } = useForm({
    mode: "all",
    defaultValues: {
      name: "",
      type: defaultType,
      emoji: "📁",
    },
  });

  const handleSave = async () => {
    const values = getValues();
    const payload = {
      name: values.name?.trim(),
      type: values.type,
      emoji: values.emoji?.trim() || "📁",
    };

    const resp = await createCategory(payload);
    onCreated?.(resp?.category);
    onClose?.();
  };

  return (
    <Dialog
      open
      width="small"
      title="Add new category"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <FormButton variant="ghost" fullWidth={false} onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton
            fullWidth={false}
            type="button"
            loading={isLoading}
            onClick={handleSave}
            disabled={!formState?.isValid}
          >
            Save
          </FormButton>
        </div>
      }
    >
      <div className="grid gap-4">
        <Controller
          name="name"
          control={control}
          rules={{ required: "Category name is required" }}
          render={({ field, fieldState }) => (
            <FormInput
              {...field}
              label="Category Name"
              placeholder="e.g. Subscriptions"
              error={fieldState.error?.message}
            />
          )}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Type</p>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <SegmentedTypeControl
                value={field.value}
                onChange={field.onChange}
                options={[
                  { id: "income", label: "Income" },
                  { id: "expense", label: "Expense" },
                  { id: "savings", label: "Savings" },
                ]}
              />
            )}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Select Emoji</p>
          <Controller
            name="emoji"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-8 gap-2">
                {CURATED_EMOJIS.map((emoji) => {
                  const selected = field.value === emoji;
                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => field.onChange(emoji)}
                      className={`grid h-10 w-10 place-items-center rounded-xl border text-xl transition ${
                        selected
                          ? "border-primary ring-2 ring-primary/30 bg-primary/10"
                          : "border-slate-200 hover:border-primary/40"
                      }`}
                      aria-label={`Select ${emoji}`}
                    >
                      <span>{emoji}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default AddCategoryInlineDialog;
