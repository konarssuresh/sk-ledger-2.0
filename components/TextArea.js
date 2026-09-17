"use client";

import clsx from "clsx";

export default function TextArea({
  label,
  error,
  helperText,
  className,
  textAreaClassName,
  rows = 4,
  ...props
}) {
  return (
    <label className={clsx("form-control w-full", className)}>
      {label ? (
        <span className="label-text mb-2 text-sm font-medium text-slate-700">
          {label}
        </span>
      ) : null}

      <textarea
        {...props}
        rows={rows}
        className={clsx(
          "textarea textarea-bordered w-full rounded-xl",
          error && "textarea-error",
          textAreaClassName,
        )}
      />

      {error ? (
        <span className="mt-2 text-xs font-medium text-error">{error}</span>
      ) : helperText ? (
        <span className="mt-2 text-xs text-slate-500">{helperText}</span>
      ) : null}
    </label>
  );
}
