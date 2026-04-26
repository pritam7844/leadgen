const STATUS_STYLES = {
  NEW: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  CONTACTED: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  QUALIFIED: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  MEETING_BOOKED: { bg: 'rgba(46,204,113,0.12)', color: '#2ECC71' },
  CONVERTED: { bg: 'rgba(255,107,26,0.12)', color: '#FF6B1A' },
  DEAD: { bg: 'rgba(80,80,80,0.1)', color: '#505050' },
  ACTIVE: { bg: 'rgba(46,204,113,0.12)', color: '#2ECC71' },
  PAUSED: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  DRAFT: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  COMPLETED: { bg: 'rgba(255,107,26,0.12)', color: '#FF6B1A' },
}

export function Badge({ status, label, custom }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.NEW
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={custom || { background: style.bg, color: style.color }}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {label || status?.replace('_', ' ')}
    </span>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className="relative w-9 h-5 rounded-full transition-all"
        style={{ background: checked ? '#FF6B1A' : '#2a2a2a' }}
        onClick={() => onChange(!checked)}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
      </div>
      {label && <span className="text-xs text-[#A8A8A8]">{label}</span>}
    </label>
  )
}
