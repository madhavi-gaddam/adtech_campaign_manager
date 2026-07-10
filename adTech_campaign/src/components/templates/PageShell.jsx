
import { LayoutDashboard, Megaphone, PlusCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { BrandLockup } from '../molecules/BrandLockup'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
  }`

export function PageShell({ children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      <div className="flex min-h-screen min-w-0">
        <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-gray-200 bg-white px-4 py-5">
          <BrandLockup />

          <nav className="mt-8 grid gap-2">
            <NavLink to="/" end className={linkClass}>
              <LayoutDashboard size={18} aria-hidden="true" />
              Dashboard
            </NavLink>

            <NavLink to="/campaigns" className={linkClass}>
              <Megaphone size={18} aria-hidden="true" />
              Campaigns
            </NavLink>

            <NavLink to="/campaigns/create" className={linkClass}>
              <PlusCircle size={18} aria-hidden="true" />
              Create Campaign
            </NavLink>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-6">
          <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
