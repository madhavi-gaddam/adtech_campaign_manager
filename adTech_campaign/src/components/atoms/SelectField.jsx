

export function SelectField({
  children,
  className = '',
  size = 'md',
  ...props
}) {
  const sizeClass = size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base'

  return (
    <select
      className={`w-full rounded-md border border-gray-300 bg-white text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}