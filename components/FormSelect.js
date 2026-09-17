import clsx from "clsx";

export default function FormSelect({
  label,
  options = [],
  error,
  helperText,
  className,
  selectClassName,
  ...props
}) {
  return (
    <label className={clsx("form-control w-full", className)}>
      {label ? (
        <span className="label-text mb-2 text-sm font-medium text-slate-700">
          {label}
        </span>
      ) : null}

      <select
        {...props}
        className={clsx(
          "select select-bordered w-full rounded-xl",
          error && "select-error",
          selectClassName,
        )}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <span className="mt-2 text-xs font-medium text-error">{error}</span>
      ) : helperText ? (
        <span className="mt-2 text-xs text-slate-500">{helperText}</span>
      ) : null}
    </label>
  );
}
