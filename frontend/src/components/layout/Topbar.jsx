import { useLocation } from 'react-router-dom'
import { Search, Plus, Bell } from 'lucide-react'
import { useState } from 'react'

const titles = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/sources': 'Sources',
  '/campaigns': 'Campaigns',
  '/automation': 'Automation',
  '/settings': 'Settings',
  '/onboarding': 'Onboarding',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
  const title = titles[pathname] || 'LeadFlow'

  return (
    <header className="flex items-center gap-3 px-6 py-3 flex-shrink-0"
      style={{ background: '#111111', borderBottom: '1px solid #1e1e1e' }}>
      <h1 className="font-bebas text-xl tracking-wide text-gradient">{title}</h1>

      <div className="flex items-center gap-2 ml-auto max-w-[220px] px-3 py-1.5 rounded-lg"
        style={{ background: '#181818', border: '1px solid #2a2a2a' }}>
        <Search size={12} className="text-[#505050]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search leads..."
          className="bg-transparent outline-none text-[11px] text-[#F2F2F2] w-full font-syne"
          style={{ '::placeholder': { color: '#505050' } }}
        />
      </div>

      <button className="p-1.5 rounded-lg text-[#A8A8A8] hover:text-[#F2F2F2] transition-colors relative"
        style={{ border: '1px solid #2a2a2a', background: '#181818' }}>
        <Bell size={13} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center text-white"
          style={{ background: '#E63946' }}>3</span>
      </button>

      <button className="btn-primary text-xs py-1.5 px-3">
        <Plus size={12} strokeWidth={2.5} />
        Add lead
      </button>
    </header>
  )
}
