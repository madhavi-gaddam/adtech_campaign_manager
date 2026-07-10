// src/components/molecules/BrandLockup.jsx

import { Megaphone } from 'lucide-react'
import { Link } from 'react-router-dom'

export function BrandLockup() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white">
        <Megaphone size={20} aria-hidden="true" />
      </div>

      <span className="text-lg font-extrabold text-gray-900">
        AdTech Manager
      </span>
    </Link>
  )
}