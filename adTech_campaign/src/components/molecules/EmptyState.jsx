

import { Link } from 'react-router-dom'
import { Button } from '../atoms/Button'

export function EmptyState({ message, actionLabel, to }) {
  return (
    <div className="mt-5 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <p className="mx-auto max-w-md text-sm font-medium text-gray-600">
        {message}
      </p>

      {to && actionLabel && (
        <Button as={Link} to={to} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}