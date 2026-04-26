import { useEffect, useState } from 'react'
import { Download, Trash2, Plus, Filter, Search } from 'lucide-react'
import { useLeads } from '../hooks/useLeads'
import { Table, Pagination } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input, Select } from '../components/ui/Input'
import { formatRelative, scoreColor } from '../utils/formatters'
import { leadApi } from '../api/leadApi'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING_BOOKED', 'CONVERTED', 'DEAD']
const INDUSTRIES = ['Real Estate', 'IT/SaaS', 'Manufacturing', 'Retail', 'Healthcare', 'Finance', 'Education']

export default function Leads() {
  const { leads, total, loading, filters, fetchLeads, fetchStats, bulkDelete, exportLeads, setFilters } = useLeads()
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    fetchLeads()
    fetchStats()
  }, [filters])

  const handleSearch = (e) => {
    const val = e.target.value
    setSearch(val)
    const timer = setTimeout(() => setFilters({ search: val, page: 0 }), 400)
    return () => clearTimeout(timer)
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === leads.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(leads.map(l => l.id)))
    }
  }

  const onCreateLead = async (data) => {
    setCreating(true)
    try {
      await leadApi.createLead(data)
      toast.success('Lead created')
      setShowCreate(false)
      reset()
      fetchLeads()
    } catch {
      toast.error('Failed to create lead')
    } finally {
      setCreating(false)
    }
  }

  const columns = [
    {
      key: 'select', label: '',
      render: (_, row) => (
        <input type="checkbox" checked={selected.has(row.id)}
          onChange={() => toggleSelect(row.id)}
          className="w-3.5 h-3.5 accent-[#FF6B1A]" />
      ),
      width: 40,
    },
    {
      key: 'name', label: 'Name',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-[#F2F2F2]">{row.firstName} {row.lastName}</div>
          <div className="text-[9px] font-mono text-[#505050]">{row.email}</div>
        </div>
      ),
    },
    { key: 'company', label: 'Company', render: (v) => <span className="text-[#A8A8A8]">{v || '—'}</span> },
    { key: 'source', label: 'Source', render: (v) => <span className="text-[#A8A8A8]">{v || '—'}</span> },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v} /> },
    {
      key: 'score', label: 'Score',
      render: (v) => v ? <span className="font-mono text-xs" style={{ color: scoreColor(v) }}>{v}</span> : '—',
    },
    { key: 'createdAt', label: 'Added', render: (v) => <span className="text-[#505050]">{formatRelative(v)}</span> },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-[280px]"
          style={{ background: '#181818', border: '1px solid #2a2a2a' }}>
          <Search size={12} className="text-[#505050]" />
          <input value={search} onChange={handleSearch} placeholder="Search leads..."
            className="bg-transparent outline-none text-[11px] text-[#F2F2F2] w-full" />
        </div>

        <Select value={filters.status || ''} onChange={e => setFilters({ status: e.target.value || undefined, page: 0 })}
          className="text-[11px] py-2 max-w-[140px]">
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </Select>

        <Select value={filters.industry || ''} onChange={e => setFilters({ industry: e.target.value || undefined, page: 0 })}
          className="text-[11px] py-2 max-w-[140px]">
          <option value="">All industries</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </Select>

        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <Button variant="danger" size="sm" onClick={() => bulkDelete([...selected]).then(() => setSelected(new Set()))}>
              <Trash2 size={12} />
              Delete {selected.size}
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={exportLeads}>
            <Download size={12} />Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus size={12} />Add lead
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center px-4 py-2 gap-3" style={{ borderBottom: '1px solid #1e1e1e' }}>
          <input type="checkbox" checked={selected.size === leads.length && leads.length > 0}
            onChange={toggleAll} className="w-3.5 h-3.5 accent-[#FF6B1A]" />
          <span className="text-[11px] text-[#505050]">
            {total.toLocaleString()} leads{selected.size > 0 && ` · ${selected.size} selected`}
          </span>
        </div>
        <Table columns={columns} data={leads} loading={loading} emptyMessage="No leads found. Import from Sources to get started." />
        <Pagination page={filters.page} total={total} size={filters.size}
          onChange={p => setFilters({ page: p })} />
      </div>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Lead">
        <form onSubmit={handleSubmit(onCreateLead)} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Input {...register('firstName')} label="First name" placeholder="Arjun" />
            <Input {...register('lastName')} label="Last name" placeholder="Kumar" />
          </div>
          <Input {...register('email')} label="Email" type="email" placeholder="lead@company.com" />
          <Input {...register('phone')} label="Phone" placeholder="+91 9800000000" />
          <Input {...register('company')} label="Company" placeholder="Acme Corp" />
          <div className="grid grid-cols-2 gap-3">
            <Input {...register('industry')} label="Industry" placeholder="IT/SaaS" />
            <Input {...register('city')} label="City" placeholder="Mumbai" />
          </div>
          <div className="flex gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" loading={creating} className="flex-1 justify-center">Create Lead</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
