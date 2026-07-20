export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm leading-6 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
      {...props}
    />
  );
}
