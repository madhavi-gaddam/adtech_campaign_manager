export function StatusBadge({ status }) {
  let color = "";

  if (status === "Active") {
    color = "bg-green-100 text-green-700";
  } else if (status === "Paused") {
    color = "bg-yellow-100 text-yellow-700";
  } else {
    color = "bg-gray-100 text-gray-700";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${color}`}
    >
      {status}
    </span>
  );
}