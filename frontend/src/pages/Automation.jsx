import { useEffect, useState } from 'react'
import { Mail, Phone, MessageSquare, Calendar, Plus, Trash2, TestTube } from 'lucide-react'
import { automationApi } from '../api/automationApi'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Toggle } from '../components/ui/Badge'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'calling', label: 'Calling', icon: Phone },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'meetings', label: 'Meetings', icon: Calendar },
]

export default function Automation() {
  const [tab, setTab] = useState('email')
  const [emailProviders, setEmailProviders] = useState([])
  const [callConfigs, setCallConfigs] = useState([])
  const [waConfigs, setWaConfigs] = useState([])
  const [meetingConfigs, setMeetingConfigs] = useState([])
  const [callProviders, setCallProviders] = useState([])
  const [waProviders, setWaProviders] = useState([])
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [showWaModal, setShowWaModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(null)

  const [emailForm, setEmailForm] = useState({ label: '', host: '', port: 587, username: '', encryptedPassword: '', fromName: '', fromEmail: '', replyToEmail: '', isDefault: false })
  const [callForm, setCallForm] = useState({ label: '', provider: '', fromNumber: '' })
  const [waForm, setWaForm] = useState({ label: '', provider: '', fromNumber: '' })

  useEffect(() => {
    automationApi.getEmailProviders().then(r => setEmailProviders(r.data.data)).catch(() => {})
    automationApi.getCallConfigs().then(r => setCallConfigs(r.data.data)).catch(() => {})
    automationApi.getCallProviders().then(r => setCallProviders(r.data.data)).catch(() => {})
    automationApi.getWhatsAppConfigs().then(r => setWaConfigs(r.data.data)).catch(() => {})
    automationApi.getWhatsAppProviders().then(r => setWaProviders(r.data.data)).catch(() => {})
    automationApi.getMeetingConfigs().then(r => setMeetingConfigs(r.data.data)).catch(() => {})
  }, [])

  const testEmail = async (id) => {
    setTesting(id)
    try {
      const res = await automationApi.testEmailProvider(id)
      if (res.data.data.success) toast.success('SMTP connection successful')
      else toast.error(res.data.data.message)
    } catch {
      toast.error('Connection test failed')
    } finally {
      setTesting(null)
    }
  }

  const saveEmail = async () => {
    setSaving(true)
    try {
      await automationApi.createEmailProvider(emailForm)
      const res = await automationApi.getEmailProviders()
      setEmailProviders(res.data.data)
      setShowEmailModal(false)
      toast.success('Email provider added')
    } catch {
      toast.error('Failed to add provider')
    } finally {
      setSaving(false)
    }
  }

  const saveCall = async () => {
    setSaving(true)
    try {
      await automationApi.createCallConfig(callForm)
      const res = await automationApi.getCallConfigs()
      setCallConfigs(res.data.data)
      setShowCallModal(false)
      toast.success('Call provider added')
    } catch {
      toast.error('Failed to save config')
    } finally {
      setSaving(false)
    }
  }

  const saveWa = async () => {
    setSaving(true)
    try {
      await automationApi.createWhatsAppConfig(waForm)
      const res = await automationApi.getWhatsAppConfigs()
      setWaConfigs(res.data.data)
      setShowWaModal(false)
      toast.success('WhatsApp provider added')
    } catch {
      toast.error('Failed to save config')
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

      {/* Email */}
      {tab === 'email' && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowEmailModal(true)}><Plus size={12} />Add SMTP provider</Button>
          </div>
          {emailProviders.length === 0 ? (
            <div className="card p-8 text-center text-xs text-[#505050]">
              No email providers yet. Add an SMTP server to start sending emails.
            </div>
          ) : emailProviders.map(p => (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#FF6B1A] flex-shrink-0"
                style={{ background: 'rgba(255,107,26,0.12)', border: '1px solid rgba(255,107,26,0.2)' }}>
                <Mail size={15} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#F2F2F2] flex items-center gap-2">
                  {p.label}
                  {p.isDefault && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,107,26,0.12)', color: '#FF6B1A' }}>DEFAULT</span>}
                </div>
                <div className="text-[10px] text-[#505050]">{p.fromEmail} · {p.host}:{p.port}</div>
              </div>
              <Button variant="secondary" size="sm" loading={testing === p.id} onClick={() => testEmail(p.id)}>
                <TestTube size={11} />Test
              </Button>
              <Button variant="danger" size="sm" onClick={async () => {
                await automationApi.deleteEmailProvider(p.id)
                setEmailProviders(prev => prev.filter(x => x.id !== p.id))
                toast.success('Provider deleted')
              }}>
                <Trash2 size={11} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Calling */}
      {tab === 'calling' && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowCallModal(true)}><Plus size={12} />Add calling provider</Button>
          </div>
          {callConfigs.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-xs text-[#505050] mb-3">Connect a calling provider to start making calls.</div>
              <div className="flex flex-wrap justify-center gap-2">
                {callProviders.map(p => (
                  <span key={p} className="text-[10px] px-2 py-1 rounded" style={{ background: '#181818', border: '1px solid #2a2a2a', color: '#A8A8A8' }}>{p}</span>
                ))}
              </div>
            </div>
          ) : callConfigs.map(c => (
            <div key={c.id} className="card p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#2ECC71] flex-shrink-0"
                style={{ background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.2)' }}>
                <Phone size={15} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#F2F2F2]">{c.label}</div>
                <div className="text-[10px] text-[#505050]">{c.provider} · {c.fromNumber}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WhatsApp */}
      {tab === 'whatsapp' && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowWaModal(true)}><Plus size={12} />Add WhatsApp provider</Button>
          </div>
          {waConfigs.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-xs text-[#505050] mb-3">Connect a WhatsApp Business provider.</div>
              <div className="flex flex-wrap justify-center gap-2">
                {waProviders.map(p => (
                  <span key={p} className="text-[10px] px-2 py-1 rounded" style={{ background: '#181818', border: '1px solid #2a2a2a', color: '#A8A8A8' }}>{p}</span>
                ))}
              </div>
            </div>
          ) : waConfigs.map(c => (
            <div key={c.id} className="card p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#F2F2F2]">{c.label}</div>
                <div className="text-[10px] text-[#505050]">{c.provider} · {c.fromNumber}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Meetings */}
      {tab === 'meetings' && (
        <div className="flex flex-col gap-3">
          {['CALENDLY', 'CAL_COM', 'GOOGLE_CALENDAR'].map(provider => {
            const connected = meetingConfigs.find(m => m.provider === provider)
            return (
              <div key={provider} className="card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#3B82F6] flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Calendar size={15} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#F2F2F2]">{provider.replace('_', ' ')}</div>
                  <div className="text-[10px] text-[#505050]">
                    {connected ? connected.bookingLink : 'Not connected'}
                  </div>
                </div>
                {connected ? (
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(46,204,113,0.12)', color: '#2ECC71' }}>Connected</span>
                ) : (
                  <Button size="sm"><Plus size={11} />Connect</Button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Email Modal */}
      <Modal open={showEmailModal} onClose={() => setShowEmailModal(false)} title="Add SMTP Provider" width={520}>
        <div className="flex flex-col gap-3">
          <Input label="Label" value={emailForm.label} onChange={e => setEmailForm(p => ({ ...p, label: e.target.value }))} placeholder="Gmail / Mailgun / etc." />
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input label="SMTP Host" value={emailForm.host} onChange={e => setEmailForm(p => ({ ...p, host: e.target.value }))} placeholder="smtp.gmail.com" />
            </div>
            <Input label="Port" type="number" value={emailForm.port} onChange={e => setEmailForm(p => ({ ...p, port: +e.target.value }))} />
          </div>
          <Input label="Username" value={emailForm.username} onChange={e => setEmailForm(p => ({ ...p, username: e.target.value }))} placeholder="user@gmail.com" />
          <Input label="Password / App password" type="password" value={emailForm.encryptedPassword} onChange={e => setEmailForm(p => ({ ...p, encryptedPassword: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <Input label="From name" value={emailForm.fromName} onChange={e => setEmailForm(p => ({ ...p, fromName: e.target.value }))} placeholder="Your Company" />
            <Input label="From email" value={emailForm.fromEmail} onChange={e => setEmailForm(p => ({ ...p, fromEmail: e.target.value }))} placeholder="hello@company.com" />
          </div>
          <Input label="Reply-to email (optional)" value={emailForm.replyToEmail} onChange={e => setEmailForm(p => ({ ...p, replyToEmail: e.target.value }))} placeholder="replies@company.com" />
          <div className="flex gap-2 mt-1">
            <Button variant="secondary" onClick={() => setShowEmailModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button loading={saving} onClick={saveEmail} className="flex-1 justify-center">Save provider</Button>
          </div>
        </div>
      </Modal>

      {/* Add Call Modal */}
      <Modal open={showCallModal} onClose={() => setShowCallModal(false)} title="Add Calling Provider">
        <div className="flex flex-col gap-3">
          <Input label="Label" value={callForm.label} onChange={e => setCallForm(p => ({ ...p, label: e.target.value }))} placeholder="My Twilio account" />
          <Select label="Provider" value={callForm.provider} onChange={e => setCallForm(p => ({ ...p, provider: e.target.value }))}>
            <option value="">Select provider</option>
            {callProviders.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
          <Input label="From number" value={callForm.fromNumber} onChange={e => setCallForm(p => ({ ...p, fromNumber: e.target.value }))} placeholder="+1234567890" />
          <div className="flex gap-2 mt-1">
            <Button variant="secondary" onClick={() => setShowCallModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button loading={saving} onClick={saveCall} className="flex-1 justify-center">Save</Button>
          </div>
        </div>
      </Modal>

      {/* Add WhatsApp Modal */}
      <Modal open={showWaModal} onClose={() => setShowWaModal(false)} title="Add WhatsApp Provider">
        <div className="flex flex-col gap-3">
          <Input label="Label" value={waForm.label} onChange={e => setWaForm(p => ({ ...p, label: e.target.value }))} placeholder="WATI account" />
          <Select label="Provider" value={waForm.provider} onChange={e => setWaForm(p => ({ ...p, provider: e.target.value }))}>
            <option value="">Select provider</option>
            {waProviders.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
          <Input label="From number" value={waForm.fromNumber} onChange={e => setWaForm(p => ({ ...p, fromNumber: e.target.value }))} placeholder="+91 9800000000" />
          <div className="flex gap-2 mt-1">
            <Button variant="secondary" onClick={() => setShowWaModal(false)} className="flex-1 justify-center">Cancel</Button>
            <Button loading={saving} onClick={saveWa} className="flex-1 justify-center">Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
