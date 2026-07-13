
import { LayoutDashboard, Megaphone, Moon, PlusCircle, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { BrandLockup } from '../molecules/BrandLockup'
import { useTheme } from '../../hooks/useTheme'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
  }`

export function PageShell({ children, rows }) {
  const isDashboard = rows === 'dashboard'
  const { isDark, setTheme } = useTheme()

  return (
    <div className={`${isDashboard ? 'lg:h-screen lg:overflow-hidden' : 'min-h-screen'} overflow-x-hidden bg-gray-100`}>
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <BrandLockup />
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
        </div>
        <nav className="mx-auto mt-3 grid max-w-7xl grid-cols-3 gap-2" aria-label="Main navigation">
          <NavLink to="/" end aria-label="Dashboard" title="Dashboard" className={({ isActive }) => `${linkClass({ isActive })} justify-center px-3`}><LayoutDashboard size={18} aria-hidden="true" /><span className="sr-only">Dashboard</span></NavLink>
          <NavLink to="/campaigns" aria-label="Campaigns" title="Campaigns" className={({ isActive }) => `${linkClass({ isActive })} justify-center px-3`}><Megaphone size={18} aria-hidden="true" /><span className="sr-only">Campaigns</span></NavLink>
          <NavLink to="/campaigns/create" aria-label="Create campaign" title="Create campaign" className={({ isActive }) => `${linkClass({ isActive })} justify-center px-3`}><PlusCircle size={18} aria-hidden="true" /><span className="sr-only">Create campaign</span></NavLink>
        </nav>
      </header>

      <div className={`flex min-w-0 ${isDashboard ? 'lg:h-screen' : 'min-h-screen'}`}>
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-gray-200 bg-white px-4 py-5 lg:block">
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

          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            className="absolute bottom-5 left-4 right-4 flex items-center justify-center px-3 py-2 text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="flex rounded-md bg-gray-100 p-0.5" aria-hidden="true">
              <span className={`flex h-9 w-9 items-center justify-center rounded ${!isDark ? 'bg-white text-amber-500 shadow-sm' : 'text-gray-500'}`}>
                <Sun size={20} />
              </span>
              <span className={`flex h-9 w-9 items-center justify-center rounded ${isDark ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}>
                <Moon size={19} />
              </span>
            </span>
          </button>
        </aside>

        <main className={`min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 ${isDashboard ? 'lg:h-screen' : ''}`}>
          <div className={`mx-auto grid w-full max-w-7xl min-w-0 gap-4 ${isDashboard ? 'lg:h-full lg:grid-rows-[auto_auto_minmax(0,1fr)]' : ''}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
