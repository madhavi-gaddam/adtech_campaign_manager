
import { LayoutDashboard, Megaphone, Moon, PlusCircle, ShieldCheck, Sun, UserCircle2, Users } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { BrandLockup } from '../molecules/BrandLockup'
import { useTheme } from '../../hooks/useTheme'
import { AuthContext } from '../../context/AuthContextValue'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
  }`

export function PageShell({ children, rows }) {
  const isDashboard = rows === 'dashboard'
  const { isDark, setTheme } = useTheme()
  const { currentUser, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const adminPath = currentUser?.role === 'Super Admin' ? '/super-admin' : '/admin'
  const hasAdminDashboard = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin'
  const adminLabel = currentUser?.role === 'Super Admin' ? 'Super Admin' : 'Admin'
  const isSuperAdmin = currentUser?.role === 'Super Admin'

  function signOut() {
    logout()
    navigate('/login')
  }

  return (
    <div className={`${isDashboard ? 'lg:h-screen lg:overflow-hidden' : 'min-h-screen'} overflow-x-clip bg-gray-100`}>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <BrandLockup />
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 ${isDark ? 'text-amber-500 dark:text-amber-400' : 'text-blue-600'}`}
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
        </div>
        <div className="mx-auto mt-3 flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <UserCircle2 size={28} className="shrink-0 text-blue-600" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-slate-100">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{currentUser?.role}</p>
            </div>
          </div>
          <button type="button" onClick={signOut} className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-bold text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-100">Logout</button>
        </div>
        <nav className={`mx-auto mt-3 grid max-w-7xl gap-2 ${isSuperAdmin ? 'grid-cols-5' : hasAdminDashboard ? 'grid-cols-4' : 'grid-cols-3'}`} aria-label="Main navigation">
          <NavLink to="/" end aria-label="User dashboard" title="User Dashboard" className={({ isActive }) => `${linkClass({ isActive })} justify-center px-3`}><LayoutDashboard size={18} aria-hidden="true" /><span className="sr-only">User Dashboard</span></NavLink>
          <NavLink to="/campaigns" aria-label="Campaigns" title="Campaigns" className={({ isActive }) => `${linkClass({ isActive })} justify-center px-3`}><Megaphone size={18} aria-hidden="true" /><span className="sr-only">Campaigns</span></NavLink>
          <NavLink to="/campaigns/create" aria-label="Create campaign" title="Create campaign" className={({ isActive }) => `${linkClass({ isActive })} justify-center px-3`}><PlusCircle size={18} aria-hidden="true" /><span className="sr-only">Create campaign</span></NavLink>
          {hasAdminDashboard && <NavLink to={adminPath} aria-label="Administration dashboard" title="Administration dashboard" className={({ isActive }) => `${linkClass({ isActive })} justify-center px-3`}><ShieldCheck size={18} aria-hidden="true" /><span className="sr-only">Administration dashboard</span></NavLink>}
          {isSuperAdmin && <NavLink to="/user-control" aria-label="User control" title="User control" className={({ isActive }) => `${linkClass({ isActive })} justify-center px-3`}><Users size={18} aria-hidden="true" /><span className="sr-only">User control</span></NavLink>}
        </nav>
      </header>

      <div className={`flex min-w-0 ${isDashboard ? 'lg:h-screen' : 'min-h-screen'}`}>
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-gray-200 bg-white px-4 py-5 lg:block">
          <BrandLockup />

          <div className="mt-5 flex items-center gap-3 border-y border-gray-200 py-4">
            <UserCircle2 size={34} className="shrink-0 text-blue-600" aria-hidden="true" />
            <div className="min-w-0"><p className="truncate text-sm font-bold text-gray-900">{currentUser?.name}</p><p className="text-xs text-gray-500">{currentUser?.role}</p></div>
          </div>

          <nav className="mt-5 grid gap-2">
            <NavLink to="/" end className={linkClass}><LayoutDashboard size={18} aria-hidden="true" />Dashboard</NavLink>
            <NavLink to="/campaigns" className={linkClass}><Megaphone size={18} aria-hidden="true" />Campaigns</NavLink>
            <NavLink to="/campaigns/create" className={linkClass}><PlusCircle size={18} aria-hidden="true" />Create Campaign</NavLink>
            {hasAdminDashboard && <NavLink to={adminPath} className={linkClass}><ShieldCheck size={18} aria-hidden="true" />{adminLabel}</NavLink>}
            {isSuperAdmin && <NavLink to="/user-control" className={linkClass}><Users size={18} aria-hidden="true" />User Control</NavLink>}
          </nav>

          <div className="absolute bottom-5 left-4 right-4 flex items-center justify-center gap-2">
            <button type="button" onClick={signOut} className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-bold text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-100">Logout</button>
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              className="flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span className="flex rounded-md border border-slate-300 dark:border-slate-600" aria-hidden="true">
                <span className={`flex h-10 w-10 items-center justify-center ${!isDark ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'}`}><Sun size={22} /></span>
                <span className={`flex h-10 w-10 items-center justify-center ${isDark ? 'text-blue-600 dark:text-sky-400' : 'text-slate-500'}`}><Moon size={21} /></span>
              </span>
            </button>
          </div>
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
