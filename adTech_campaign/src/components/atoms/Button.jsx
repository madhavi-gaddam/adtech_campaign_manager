// src/components/atoms/Button.jsx

import { forwardRef } from 'react'

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    children,
    className = '',
    variant = 'primary',
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      type={Component === 'button' ? type : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
})