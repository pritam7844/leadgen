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
    <label className="flex items-center gap-2 cursor-pointer group">
      <div
        className="relative w-9 h-5 rounded-full transition-all duration-200"
        style={{ background: checked ? '#FF6B1A' : '#2a2a2a' }}
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
      >
        <div 
          className="absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-200 shadow-sm" 
          style={{ left: checked ? '20px' : '4px' }}
        />
      </div>
      {label && <span className="text-xs text-[#A8A8A8] group-hover:text-[#F2F2F2] transition-colors">{label}</span>}
    </label>
  )
}
