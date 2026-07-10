
export function Input({
  type = "text",
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
      {...props}
    />
  );
}
