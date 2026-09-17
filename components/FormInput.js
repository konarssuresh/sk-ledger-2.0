import clsx from "clsx";

export default function FormInput({
  label,
  error,
  helperText,
  className,
  inputClassName,
  ...props
}) {
  return (
    <label className={clsx("form-control w-full", className)}>
      {label ? (
        <span className="label-text mb-2 text-sm font-medium text-slate-700">
          {label}
        </span>
      ) : null}

      <input
        {...props}
        className={clsx(
          "input input-bordered w-full rounded-xl",
          error && "input-error",
          inputClassName,
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
