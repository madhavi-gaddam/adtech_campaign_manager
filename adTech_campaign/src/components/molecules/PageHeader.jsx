
export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-1 break-all text-2xl font-extrabold text-gray-900">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  )
}
