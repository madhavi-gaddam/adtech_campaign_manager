// src/components/atoms/MetricCard.jsx

export function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="text-sm font-bold text-gray-500">{label}</p>

      <h2 className="mt-1 text-xl font-extrabold text-gray-900">
        {value}
      </h2>
    </div>
  )
}
