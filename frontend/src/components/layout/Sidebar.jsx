import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Database, Zap, Settings,
  Mail, GitBranch, Calendar, LogOut, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Leads', icon: Users, to: '/leads', badge: null },
  { label: 'Sources', icon: Database, to: '/sources' },
  { label: 'Campaigns', icon: GitBranch, to: '/campaigns' },
  { label: 'Automation', icon: Zap, to: '/automation' },
  { label: 'Meetings', icon: Calendar, to: '/meetings' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'U'

  return (
    <aside style={{ width: 196, background: '#111111', borderRight: '1px solid #1e1e1e' }}
      className="flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-3.5" style={{ borderBottom: '1px solid #1e1e1e' }}>
        <div className="flex items-center justify-center w-7 h-7 rounded-lg text-white font-bebas text-sm"
          style={{ background: 'linear-gradient(135deg, #FF6B1A, #E63946)' }}>L</div>
        <span className="font-bebas text-base tracking-wide text-gradient">LeadFlow</span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(255,107,26,.15)', border: '1px solid rgba(255,107,26,.3)', color: '#FF6B1A' }}>
          PRO
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all relative cursor-pointer ${
                isActive
                  ? 'text-[#FF6B1A]'
                  : 'text-[#A8A8A8] hover:text-[#F2F2F2]'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'rgba(255,107,26,.07)' } : {}}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-sm"
                    style={{ background: 'linear-gradient(180deg, #FF6B1A, #E63946)' }} />
                )}
                <Icon size={13} strokeWidth={1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="flex items-center gap-2 px-3 py-3" style={{ borderTop: '1px solid #1e1e1e' }}>
        <div className="flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF6B1A, #E63946)' }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-[#F2F2F2] truncate">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="text-[9px] text-[#505050]">
            {user?.plan} · {user?.credits?.toLocaleString()} credits
          </div>
        </div>
        <button onClick={logout} className="text-[#505050] hover:text-[#E63946] transition-colors p-1">
          <LogOut size={12} />
        </button>
      </div>
    </aside>
  )
}
