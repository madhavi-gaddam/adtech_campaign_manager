export function InfoItem({ label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 border-b border-gray-200 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="font-semibold text-gray-700">
        {label}
      </p>

      <p className="min-w-0 break-words [overflow-wrap:anywhere] text-gray-600 sm:text-right">
        {value}
      </p>
    </div>
  );
}
