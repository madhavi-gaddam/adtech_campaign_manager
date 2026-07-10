export function StatusBadge({ status }) {
  const color =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : status === "Paused"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${color}`}
    >
      {status}
    </span>
  );
}
