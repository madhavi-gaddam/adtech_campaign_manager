export function InfoItem({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-3">
      <p className="font-semibold text-gray-700">
        {label}
      </p>

      <p className="text-gray-600">
        {value}
      </p>
    </div>
  );
}