import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Globe, Code, Database, Plus, Trash2, Play, RefreshCw } from 'lucide-react'
import { sourceApi } from '../api/sourceApi'
import { integrationApi } from '../api/integrationApi'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Badge, Toggle } from '../components/ui/Badge'
import { formatRelative } from '../utils/formatters'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'scraper-api', label: 'Scraper APIs', icon: Globe },
  { id: 'custom', label: 'Custom Scraper', icon: Code },
  { id: 'platform', label: 'Integrations', icon: Database },
  { id: 'csv', label: 'CSV Upload', icon: Upload },
]

const PLATFORMS = [
  { key: 'LINKEDIN', label: 'LinkedIn' },
  { key: 'INDIAMART', label: 'IndiaMart' },
  { key: 'JUSTDIAL', label: 'JustDial' },
  { key: 'TRADEINDIA', label: 'TradeIndia' },
  { key: 'SULEKHA', label: 'Sulekha' },
]

const PLATFORM_INTEGRATIONS = [
  { key: 'APOLLO', label: 'Apollo.io', desc: 'Search verified contacts by industry, location, company size' },
  { key: 'GHL', label: 'GoHighLevel', desc: 'Two-way sync with GHL CRM' },
  { key: 'HUBSPOT', label: 'HubSpot', desc: 'Import contacts from HubSpot CRM' },
]

export default function Sources() {
  const [tab, setTab] = useState('csv')
  const [sources, setSources] = useState([])
  const [scrapers, setScrapers] = useState([])
  const [integrations, setIntegrations] = useState([])
  const [uploadResult, setUploadResult] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showApiModal, setShowApiModal] = useState(false)
  const [apiForm, setApiForm] = useState({ name: '', apiEndpoint: '', authType: 'BEARER', encryptedAuthValue: '', responsePath: '' })
  const [saving, setSaving] = useState(false)
  const [runningId, setRunningId] = useState(null)

  useEffect(() => {
    sourceApi.getSources().then(r => setSources(r.data.data)).catch(() => {})
    sourceApi.getScrapers().then(r => setScrapers(r.data.data)).catch(() => {})
    integrationApi.getIntegrations().then(r => setIntegrations(r.data.data)).catch(() => {})
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.csv'] },
    maxFiles: 1,
    onDrop: async ([file]) => {
      if (!file) return
      setUploading(true)
      setUploadResult(null)
      try {
        const res = await sourceApi.csvUpload(file)
        setUploadResult(res.data.data)
        toast.success(`Imported ${res.data.data.leadsAdded} leads`)
      } catch {
        toast.error('Failed to import CSV')
      } finally {
        setUploading(false)
      }
    },
  })

  const toggleScraper = async (id) => {
    const res = await sourceApi.toggleScraper(id)
    setScrapers(prev => prev.map(s => s.id === id ? res.data.data : s))
  }

  const runScraper = async (id) => {
    setRunningId(id)
    try {
      const res = await sourceApi.runScraper(id)
      toast.success(`Scraper done — ${res.data.data.leadsAdded} leads added`)
    } catch {
      toast.error('Scraper failed')
    } finally {
      setRunningId(null)
    }
  }

  const saveApiSource = async () => {
    setSaving(true)
    try {
      await sourceApi.createSource({ name: apiForm.name, type: 'SCRAPER_API', config: apiForm })
      const res = await sourceApi.getSources()
      setSources(res.data.data)
      setShowApiModal(false)
      toast.success('API source added')
    } catch {
      toast.error('Failed to add source')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-0.5" style={{ borderBottom: '1px solid #1e1e1e' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold transition-all"
            style={tab === id
              ? { color: '#FF6B1A', borderBottom: '2px solid #FF6B1A', marginBottom: -1 }
              : { color: '#505050', borderBottom: '2px solid transparent' }}>
            <Icon size={11} />{label}
          </button>
        ))}
      </div>

      {/* CSV Upload tab */}
      {tab === 'csv' && (
        <div className="flex flex-col items-center gap-4 pt-4">
          <div {...getRootProps()}
            className="w-full max-w-xl rounded-xl border-2 border-dashed p-12 flex flex-col items-center gap-3 cursor-pointer transition-all"
            style={{
              borderColor: isDragActive ? '#FF6B1A' : '#2a2a2a',
              background: isDragActive ? 'rgba(255,107,26,0.05)' : '#111111'
            }}>
            <input {...getInputProps()} />
            <Upload size={32} className={isDragActive ? 'text-[#FF6B1A]' : 'text-[#505050]'} />
            <div className="text-center">
              <div className="text-sm font-semibold text-[#F2F2F2]">
                {isDragActive ? 'Drop your CSV here' : 'Drag & drop a CSV file'}
              </div>
              <div className="text-xs text-[#505050] mt-1">or click to browse · Max 50MB · 50,000 rows</div>
            </div>
            {uploading && <div className="w-5 h-5 border-2 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />}
          </div>
          {uploadResult && (
            <div className="card p-4 text-center">
              <div className="text-2xl font-bebas text-[#FF6B1A] mb-1">{uploadResult.leadsAdded}</div>
              <div className="text-xs text-[#505050]">leads imported from {uploadResult.total} rows</div>
            </div>
          )}
          <div className="text-xs text-[#505050] max-w-sm text-center">
            CSV must have headers. Supported columns: <span className="text-[#A8A8A8]">email, first_name, last_name, phone, company, industry, city</span>
          </div>
        </div>
      )}

      {/* Scraper API tab */}
      {tab === 'scraper-api' && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowApiModal(true)}><Plus size={12} />Add API source</Button>
          </div>
          {sources.filter(s => s.type === 'SCRAPER_API').length === 0 ? (
            <div className="card p-8 text-center text-xs text-[#505050]">
              No API sources yet. Add an Apify actor or any REST API endpoint.
            </div>
          ) : (
            sources.filter(s => s.type === 'SCRAPER_API').map(source => (
              <div key={source.id} className="card p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#F2F2F2]">{source.name}</div>
                  <div className="text-[10px] text-[#505050] mt-0.5">{source.config?.apiEndpoint}</div>
                </div>
                <span className="text-[10px] text-[#505050]">
                  {source.lastRun ? formatRelative(source.lastRun) : 'Never run'}
                </span>
                <span className="text-[10px] font-semibold" style={{ color: '#FF6B1A' }}>+{source.leadsAdded}</span>
                <Button variant="secondary" size="sm"><Play size={11} />Run</Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Custom Scraper tab */}
      {tab === 'custom' && (
        <div className="flex flex-col gap-3">
          {PLATFORMS.map(({ key, label }) => {
            const sc = scrapers.find(s => s.platform === key)
            return (
              <div key={key} className="card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FF6B1A, #E63946)' }}>
                  {label[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#F2F2F2]">{label}</div>
                  <div className="text-[10px] text-[#505050]">
                    {sc?.lastRun ? `Last run: ${formatRelative(sc.lastRun)}` : 'Not configured'}
                  </div>
                </div>
                {sc && (
                  <Button variant="secondary" size="sm" loading={runningId === sc.id}
                    onClick={() => runScraper(sc.id)}>
                    <RefreshCw size={11} />Run
                  </Button>
                )}
                <Toggle
                  checked={sc?.isEnabled || false}
                  onChange={sc ? () => toggleScraper(sc.id) : async () => {
                    const res = await sourceApi.createScraper({ platform: key, isEnabled: true })
                    setScrapers(prev => [...prev, res.data.data])
                  }}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Platform Integrations tab */}
      {tab === 'platform' && (
        <div className="flex flex-col gap-3">
          {PLATFORM_INTEGRATIONS.map(({ key, label, desc }) => {
            const integration = integrations.find(i => i.name === key)
            return (
              <div key={key} className="card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold text-[#FF6B1A] flex-shrink-0"
                  style={{ background: 'rgba(255,107,26,0.12)', border: '1px solid rgba(255,107,26,0.2)' }}>
                  {label[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#F2F2F2]">{label}</div>
                  <div className="text-[10px] text-[#505050]">{desc}</div>
                </div>
                {integration ? (
                  <Button variant="secondary" size="sm"><Play size={11} />Sync</Button>
                ) : (
                  <Button size="sm" onClick={() => setShowApiModal(true)}><Plus size={11} />Connect</Button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add API source modal */}
      <Modal open={showApiModal} onClose={() => setShowApiModal(false)} title="Add API Source">
        <div className="flex flex-col gap-3">
          <Input label="Source name" value={apiForm.name}
            onChange={e => setApiForm(p => ({ ...p, name: e.target.value }))} placeholder="My Apify Scraper" />
          <Input label="API endpoint" value={apiForm.apiEndpoint}
            onChange={e => setApiForm(p => ({ ...p, apiEndpoint: e.target.value }))} placeholder="https://api.apify.com/v2/acts/.../runs" />
          <Select label="Auth type" value={apiForm.authType}
            onChange={e => setApiForm(p => ({ ...p, authType: e.target.value }))}>
            <option value="BEARER">Bearer token</option>
            <option value="API_KEY_HEADER">API key header</option>
            <option value="API_KEY_PARAM">API key param</option>
            <option value="BASIC">Basic auth</option>
          </Select>
          <Input label="Auth value / Token" value={apiForm.encryptedAuthValue}
            onChange={e => setApiForm(p => ({ ...p, encryptedAuthValue: e.target.value }))} placeholder="Bearer token or API key" type="password" />
          <Input label="Response path (JSON)" value={apiForm.responsePath}
            onChange={e => setApiForm(p => ({ ...p, responsePath: e.target.value }))} placeholder="/data/items or /results" />
          <div className="flex gap-2 mt-2">
            <Button variant="secondary" onClick={() => setShowApiModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button loading={saving} onClick={saveApiSource} className="flex-1 justify-center">Add source</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
