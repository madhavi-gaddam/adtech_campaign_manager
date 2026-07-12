export function Button({
  as: Component = "button",
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  let buttonStyle = "";

  if (variant === "primary") {
    buttonStyle = "bg-blue-600 text-white hover:bg-blue-700";
  } else if (variant === "secondary") {
    buttonStyle =
      "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50";
  } else if (variant === "danger") {
    buttonStyle = "bg-red-600 text-white hover:bg-red-700";
  }

  return (
    <Component
      type={Component === "button" ? type : undefined}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition ${buttonStyle} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
