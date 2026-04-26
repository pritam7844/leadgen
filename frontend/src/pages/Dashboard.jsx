import { useEffect, useState } from 'react'
import { Users, Phone, Calendar, CreditCard, PlayCircle, CheckCircle } from 'lucide-react'
import { dashboardApi } from '../api/dashboardApi'
import { leadApi } from '../api/leadApi'
import { formatRelative, formatNumber, statusBadge, scoreColor } from '../utils/formatters'
import { Badge } from '../components/ui/Badge'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'

const CITIES = {
  north: ['Delhi NCR', 'Lucknow', 'Jaipur', 'Chandigarh', 'Noida', 'Gurgaon'],
  west: ['Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Nagpur'],
  south: ['Bengaluru', 'Chennai', 'Hyderabad', 'Kochi', 'Coimbatore'],
  east: ['Kolkata', 'Bhubaneswar', 'Patna', 'Guwahati'],
  global: ['Dubai, UAE', 'Singapore', 'London, UK', 'New York, USA'],
}

const INDUSTRIES = ['Real Estate', 'IT/SaaS', 'Manufacturing', 'Retail', 'Healthcare', 'Finance', 'Education']
const SIZES = ['1–10', '11–50', '51–200', '200+']
const SOURCES = ['Apollo', 'Scraper', 'CSV', 'API']

function StatCard({ label, value, sub, icon: Icon, iconClass, trend }) {
  return (
    <div className="card p-4 transition-all hover:border-[rgba(255,107,26,0.25)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#505050]">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon size={13} strokeWidth={1.8} />
        </div>
      </div>
      <div className="font-bebas text-[32px] leading-none mb-1">{value}</div>
      {sub && <div className={`text-[10px] font-medium ${trend === 'up' ? 'text-[#2ECC71]' : trend === 'down' ? 'text-[#E63946]' : 'text-[#505050]'}`}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [region, setRegion] = useState('')
  const [city, setCity] = useState('')
  const [selIndustries, setSelIndustries] = useState([])
  const [selSizes, setSelSizes] = useState([])
  const [selSources, setSelSources] = useState(['Apollo', 'Scraper'])
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState(null)

  useEffect(() => {
    dashboardApi.getStats().then(r => setStats(r.data.data)).catch(() => {})
    leadApi.getLeads({ page: 0, size: 8, sortBy: 'createdAt', sortDir: 'desc' })
      .then(r => setRecentLeads(r.data.data.content || [])).catch(() => {})
  }, [])

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const runArea = async () => {
    if (!region) return
    setRunning(true)
    setRunResult(null)
    setTimeout(() => {
      const count = Math.floor(150 + Math.random() * 300)
      setRunResult(count)
      setRunning(false)
    }, 2800)
  }

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    leads: Math.floor(10 + Math.random() * 60),
  }))

  return (
    <div className="flex gap-4 h-full">
      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Leads" value={formatNumber(stats?.totalLeads || 0)}
            sub="+124 this week" trend="up" icon={Users}
            iconClass="bg-[rgba(255,107,26,0.12)] text-[#FF6B1A]" />
          <StatCard label="Contacted" value={formatNumber(stats?.contacted || 0)}
            sub={stats ? `${Math.round((stats.contacted / Math.max(stats.totalLeads, 1)) * 100)}% of total` : '—'}
            icon={Phone} iconClass="bg-[rgba(46,204,113,0.12)] text-[#2ECC71]" />
          <StatCard label="Meetings Booked" value={formatNumber(stats?.meetingsBooked || 0)}
            sub="+8 this month" trend="up" icon={Calendar}
            iconClass="bg-[rgba(59,130,246,0.12)] text-[#3B82F6]" />
          <StatCard label="Converted" value={formatNumber(stats?.converted || 0)}
            sub="This quarter" icon={CheckCircle}
            iconClass="bg-[rgba(230,57,70,0.12)] text-[#E63946]" />
        </div>

        {/* Chart */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#F2F2F2]">Leads imported — last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={chartData} barSize={6}>
              <Bar dataKey="leads" fill="rgba(255,107,26,0.3)" radius={[2, 2, 0, 0]}
                activeBar={{ fill: '#FF6B1A' }} />
              <Tooltip
                contentStyle={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: 6, fontFamily: 'Syne', fontSize: 11 }}
                labelStyle={{ color: '#505050' }}
                itemStyle={{ color: '#FF6B1A' }}
                cursor={{ fill: 'rgba(255,107,26,0.05)' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent leads */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-1 px-4 py-2" style={{ borderBottom: '1px solid #1e1e1e' }}>
            <span className="text-[11px] font-semibold text-[#FF6B1A]">Recent Leads</span>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                {['Name', 'Company', 'Source', 'Status', 'Added'].map(h => (
                  <th key={h} className="text-left text-[9px] font-bold uppercase tracking-wider px-3 py-2"
                    style={{ color: '#505050', background: '#181818', borderBottom: '1px solid #1e1e1e' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-[#505050] text-xs">No leads yet. Import your first leads from Sources.</td></tr>
              ) : recentLeads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '0.5px solid #1e1e1e' }}
                  className="hover:bg-[rgba(255,107,26,0.025)] transition-colors cursor-default">
                  <td className="px-3 py-2">
                    <div className="text-[11px] font-semibold text-[#F2F2F2]">{lead.firstName} {lead.lastName}</div>
                    <div className="text-[9px] text-[#505050] font-mono">{lead.email}</div>
                  </td>
                  <td className="px-3 py-2 text-[11px] text-[#A8A8A8]">{lead.company || '—'}</td>
                  <td className="px-3 py-2 text-[10px] text-[#A8A8A8]">{lead.source || '—'}</td>
                  <td className="px-3 py-2"><Badge status={lead.status} /></td>
                  <td className="px-3 py-2 text-[10px] text-[#505050]">{formatRelative(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[230px] flex-shrink-0 flex flex-col gap-3">
        {/* Area runner */}
        <div className="card p-3">
          <div className="flex items-center gap-1.5 mb-3">
            <PlayCircle size={11} className="text-[#FF6B1A]" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#505050]">Run for area</span>
          </div>

          {/* Region */}
          <div className="mb-2">
            <div className="label">Location</div>
            <select value={region} onChange={e => { setRegion(e.target.value); setCity('') }}
              className="input-field text-[11px]" style={{ fontSize: 11 }}>
              <option value="">— Region —</option>
              {Object.keys(CITIES).map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)} India</option>)}
            </select>
            {region && (
              <select value={city} onChange={e => setCity(e.target.value)} className="input-field text-[11px] mt-1" style={{ fontSize: 11 }}>
                <option value="">— All cities —</option>
                {CITIES[region].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          {/* Industry tags */}
          <div className="mb-2">
            <div className="label">Industry</div>
            <div className="flex flex-wrap gap-1">
              {INDUSTRIES.map(ind => (
                <button key={ind} onClick={() => toggleArr(selIndustries, setSelIndustries, ind)}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-all"
                  style={selIndustries.includes(ind)
                    ? { color: '#FF6B1A', border: '1px solid rgba(255,107,26,0.4)', background: 'rgba(255,107,26,0.08)' }
                    : { color: '#505050', border: '1px solid #2a2a2a', background: '#181818' }}>
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-2">
            <div className="label">Company Size</div>
            <div className="flex flex-wrap gap-1">
              {SIZES.map(s => (
                <button key={s} onClick={() => toggleArr(selSizes, setSelSizes, s)}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-all"
                  style={selSizes.includes(s)
                    ? { color: '#3B82F6', border: '1px solid rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.08)' }
                    : { color: '#505050', border: '1px solid #2a2a2a', background: '#181818' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="mb-3">
            <div className="label">Sources</div>
            <div className="flex flex-wrap gap-1">
              {SOURCES.map(s => (
                <button key={s} onClick={() => toggleArr(selSources, setSelSources, s)}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-all"
                  style={selSources.includes(s)
                    ? { color: '#FF6B1A', border: '1px solid rgba(255,107,26,0.4)', background: 'rgba(255,107,26,0.08)' }
                    : { color: '#505050', border: '1px solid #2a2a2a', background: '#181818' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg p-2 mb-3 text-[10px] text-[#505050]"
            style={{ background: '#181818', border: '1px solid #2a2a2a' }}>
            {region
              ? <span><span style={{ color: '#FF6B1A', fontWeight: 700 }}>{city || region}</span>
                  {selIndustries.length > 0 && <> · <span style={{ color: '#FF6B1A', fontWeight: 700 }}>{selIndustries.join(', ')}</span></>}
                  {selSources.length > 0 && <> via <span style={{ color: '#FF6B1A', fontWeight: 700 }}>{selSources.join(' + ')}</span></>}
                </span>
              : 'Select filters above to configure your run'}
          </div>

          <button onClick={runArea} disabled={!region || running}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-1.5"
            style={{ background: 'linear-gradient(135deg, #FF6B1A, #E63946)', boxShadow: '0 3px 10px rgba(255,107,26,0.3)' }}>
            {running ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <PlayCircle size={11} />}
            {running ? 'Running...' : 'Run system for area'}
          </button>

          {runResult !== null && (
            <div className="text-center text-[10px]" style={{ color: '#F59E0B' }}>
              ✓ Done — {runResult} leads added
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
