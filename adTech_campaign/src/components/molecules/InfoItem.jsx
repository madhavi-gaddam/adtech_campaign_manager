export function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-200 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="font-semibold text-gray-700">
        {label}
      </p>

      <p className="break-words text-gray-600 sm:text-right">
        {value}
      </p>
    </div>
  );
}
