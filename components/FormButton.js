import clsx from "clsx";

const variantClassMap = {
  primary: "btn-primary text-white",
  secondary: "btn-secondary text-white",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

export default function FormButton({
  children,
  type = "button",
  variant = "primary",
  fullWidth = true,
  loading = false,
  className,
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        "btn rounded-xl",
        fullWidth && "w-full",
        variantClassMap[variant] || variantClassMap.primary,
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="loading loading-spinner loading-sm" /> : null}
      {children}
    </button>
  );
}
