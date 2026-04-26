export function Table({ columns, data, onRowClick, loading, emptyMessage = 'No data' }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className="text-left text-[9px] font-bold uppercase tracking-wider px-3 py-2"
                style={{ color: '#505050', borderBottom: '1px solid #1e1e1e', background: '#181818' }}
                width={col.width}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-[#505050] text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i}
                className={onRowClick ? 'cursor-pointer' : ''}
                onClick={() => onRowClick?.(row)}
                style={{ borderBottom: '0.5px solid #1e1e1e' }}
                onMouseEnter={e => { if (onRowClick) e.currentTarget.style.background = 'rgba(255,107,26,0.025)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '' }}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-3 py-2 text-xs">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({ page, total, size, onChange }) {
  const pages = Math.ceil(total / size)
  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #1e1e1e' }}>
      <span className="text-[11px] text-[#505050]">
        {page * size + 1}–{Math.min((page + 1) * size, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 0}
          className="px-2 py-1 text-[11px] rounded disabled:opacity-30 text-[#A8A8A8] hover:text-[#F2F2F2] transition-colors">
          ‹
        </button>
        {Array.from({ length: Math.min(5, pages) }, (_, i) => {
          const p = Math.max(0, Math.min(page - 2, pages - 5)) + i
          return (
            <button key={p} onClick={() => onChange(p)}
              className="w-6 h-6 text-[11px] rounded transition-colors"
              style={p === page
                ? { background: 'rgba(255,107,26,0.15)', color: '#FF6B1A' }
                : { color: '#505050' }}>
              {p + 1}
            </button>
          )
        })}
        <button onClick={() => onChange(page + 1)} disabled={page >= pages - 1}
          className="px-2 py-1 text-[11px] rounded disabled:opacity-30 text-[#A8A8A8] hover:text-[#F2F2F2] transition-colors">
          ›
        </button>
      </div>
    </div>
  )
}
