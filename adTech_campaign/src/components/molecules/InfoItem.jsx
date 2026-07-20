export function InfoItem({ label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 border-b border-gray-200 py-2.5 landscape:py-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      <p className="shrink-0 text-sm font-semibold text-gray-700">
        {label}
      </p>

      <p className="min-w-0 max-w-full break-words text-sm text-gray-600 [overflow-wrap:anywhere] lg:text-right">
        {value}
      </p>
    </div>
  );
}
