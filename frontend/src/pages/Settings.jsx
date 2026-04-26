import { useEffect, useState } from 'react'
import { Key, Users, CreditCard, Bell, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'apikeys', label: 'API Key Vault', icon: Key },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

const SERVICES = ['APOLLO', 'GHL', 'HUBSPOT', 'APIFY', 'TWILIO', 'EXOTEL', 'PLIVO', 'VAPI', 'KNOWLARITY', 'SERVETEL', 'WATI', 'INTERAKT', 'GUPSHUP', 'RAZORPAY', 'STRIPE']

export default function Settings() {
  const [tab, setTab] = useState('apikeys')
  const [apiKeys, setApiKeys] = useState([])
  const [showAddKey, setShowAddKey] = useState(false)
  const [keyForm, setKeyForm] = useState({ service: '', label: '', key: '' })
  const [saving, setSaving] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    api.get('/api-keys').then(r => setApiKeys(r.data.data)).catch(() => {})
    api.get('/subscription/current').then(r => setSubscription(r.data.data)).catch(() => {})
    api.get('/subscription/plans').then(r => setPlans(r.data.data)).catch(() => {})
  }, [])

  const saveKey = async () => {
    if (!keyForm.service || !keyForm.key) { toast.error('Service and key are required'); return }
    setSaving(true)
    try {
      await api.post('/api-keys', keyForm)
      const res = await api.get('/api-keys')
      setApiKeys(res.data.data)
      setShowAddKey(false)
      setKeyForm({ service: '', label: '', key: '' })
      toast.success('API key saved')
    } catch {
      toast.error('Failed to save key')
    } finally {
      setSaving(false)
    }
  }

  const deleteKey = async (id) => {
    await api.delete(`/api-keys/${id}`)
    setApiKeys(prev => prev.filter(k => k.id !== id))
    toast.success('Key deleted')
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

      {/* API Keys */}
      {tab === 'apikeys' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#505050]">All keys are AES-256 encrypted. Raw values are never stored.</div>
            <Button size="sm" onClick={() => setShowAddKey(true)}><Plus size={12} />Add key</Button>
          </div>
          {apiKeys.length === 0 ? (
            <div className="card p-8 text-center text-xs text-[#505050]">
              No API keys stored yet. Add keys for Apollo, Twilio, and other services.
            </div>
          ) : apiKeys.map(key => (
            <div key={key.id} className="card p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#FF6B1A] flex-shrink-0 font-bold text-xs"
                style={{ background: 'rgba(255,107,26,0.12)', border: '1px solid rgba(255,107,26,0.2)' }}>
                {key.service?.[0]}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#F2F2F2]">{key.service}</div>
                <div className="text-[10px] text-[#505050] flex items-center gap-1.5">
                  <span>{key.label || 'No label'}</span>
                  <span>·</span>
                  <span className="font-mono">{key.encryptedKey}</span>
                </div>
              </div>
              <button onClick={() => deleteKey(key.id)} className="text-[#505050] hover:text-[#E63946] transition-colors p-1">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Team */}
      {tab === 'team' && (
        <div className="card p-8 text-center">
          <Users size={28} className="mx-auto mb-3 text-[#505050]" />
          <div className="text-sm text-[#505050]">Team management available on Pro plan.</div>
        </div>
      )}

      {/* Billing */}
      {tab === 'billing' && (
        <div className="flex flex-col gap-4">
          {subscription && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bebas text-2xl text-gradient">{subscription.plan} Plan</div>
                  <div className="text-xs text-[#505050]">{subscription.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#F2F2F2]">
                    {subscription.leadsLimit === -1 ? 'Unlimited' : subscription.leadsLimit} leads
                  </div>
                  <div className="text-xs text-[#505050]">{subscription.leadsUsed} used</div>
                </div>
              </div>
              {subscription.leadsLimit > 0 && (
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#2a2a2a' }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: `${(subscription.leadsUsed / subscription.leadsLimit) * 100}%`,
                      background: 'linear-gradient(90deg, #FF6B1A, #FFB627)'
                    }} />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {plans.map(plan => (
              <div key={plan.name} className="card p-4"
                style={plan.name === 'PRO' ? { border: '1px solid rgba(255,107,26,0.3)' } : {}}>
                <div className="font-bebas text-xl text-[#F2F2F2] mb-1">{plan.name}</div>
                <div className="font-bebas text-3xl text-gradient mb-3">
                  {plan.price === 0 ? 'Free' : `₹${plan.price}/mo`}
                </div>
                <ul className="flex flex-col gap-1.5 mb-4">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-[11px] text-[#A8A8A8]">
                      <span className="w-1 h-1 rounded-full bg-[#FF6B1A]" />
                      {f}
                    </li>
                  ))}
                </ul>
                {subscription?.plan !== plan.name && (
                  <Button size="sm" variant={plan.name === 'PRO' ? 'primary' : 'secondary'} className="w-full justify-center">
                    Upgrade
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="card p-5 text-xs text-[#505050]">
          Notification preferences coming soon.
        </div>
      )}

      {/* Add Key Modal */}
      <Modal open={showAddKey} onClose={() => setShowAddKey(false)} title="Add API Key">
        <div className="flex flex-col gap-3">
          <Select label="Service" value={keyForm.service} onChange={e => setKeyForm(p => ({ ...p, service: e.target.value }))}>
            <option value="">Select service</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Input label="Label (optional)" value={keyForm.label} onChange={e => setKeyForm(p => ({ ...p, label: e.target.value }))} placeholder="Production key" />
          <Input label="API Key" type="password" value={keyForm.key} onChange={e => setKeyForm(p => ({ ...p, key: e.target.value }))} placeholder="Paste your key here" />
          <div className="text-[10px] text-[#505050]">Your key will be encrypted with AES-256 before storage.</div>
          <div className="flex gap-2 mt-1">
            <Button variant="secondary" onClick={() => setShowAddKey(false)} className="flex-1 justify-center">Cancel</Button>
            <Button loading={saving} onClick={saveKey} className="flex-1 justify-center">Save key</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
