

export function SectionPanel({ children, className = '' }) {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </section>
  )
}