import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Database, Key, Users, Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import api from '../api/axios'
import { sourceApi } from '../api/sourceApi'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, title: 'Connect a source', desc: 'Pull leads from Apollo, CSV, or a scraper API', icon: Database },
  { id: 2, title: 'Add an API key', desc: 'Securely store credentials for your integrations', icon: Key },
  { id: 3, title: 'Import first leads', desc: 'Upload a CSV or trigger a source run', icon: Users },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [service, setService] = useState('APOLLO')
  const [apiKey, setApiKey] = useState('')
  const [saving, setSaving] = useState(false)

  const completeStep = async () => {
    setSaving(true)
    try {
      if (step === 2 && apiKey) {
        await api.post('/api-keys', { service, key: apiKey, label: 'Onboarding key' })
        toast.success('API key saved')
      }
      if (step < 3) {
        setStep(s => s + 1)
      } else {
        navigate('/dashboard')
        toast.success('Setup complete! Welcome to LeadFlow.')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-[500px] px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl text-white font-bebas text-xl"
            style={{ background: 'linear-gradient(135deg, #FF6B1A, #E63946)' }}>L</div>
          <span className="font-bebas text-2xl tracking-wide text-gradient">LeadFlow</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > s.id ? 'bg-[#2ECC71] text-white' :
                step === s.id ? 'text-white' : 'text-[#505050]'
              }`} style={step === s.id ? { background: 'linear-gradient(135deg, #FF6B1A, #E63946)' } : step <= s.id ? { background: '#2a2a2a' } : {}}>
                {step > s.id ? <Check size={12} /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-12 h-0.5 rounded" style={{ background: step > s.id ? '#2ECC71' : '#2a2a2a' }} />
              )}
            </div>
          ))}
        </div>

        <div className="card p-6">
          {STEPS.map(s => {
            if (s.id !== step) return null
            const Icon = s.icon
            return (
              <div key={s.id}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#FF6B1A]"
                    style={{ background: 'rgba(255,107,26,0.12)', border: '1px solid rgba(255,107,26,0.2)' }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#F2F2F2]">Step {s.id}: {s.title}</h2>
                    <p className="text-xs text-[#505050]">{s.desc}</p>
                  </div>
                </div>

                {step === 1 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-[#A8A8A8]">
                      LeadFlow supports Apollo.io, CSV uploads, Apify scrapers, and custom REST API connectors. You can add more sources any time from the Sources page.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {['Apollo.io', 'CSV Upload', 'Apify Scraper'].map(src => (
                        <div key={src} className="rounded-lg p-3 text-center text-xs font-semibold text-[#A8A8A8] cursor-pointer transition-all hover:border-[rgba(255,107,26,0.4)] hover:text-[#FF6B1A]"
                          style={{ background: '#181818', border: '1px solid #2a2a2a' }}>
                          {src}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-3">
                    <Select label="Service" value={service} onChange={e => setService(e.target.value)}>
                      {['APOLLO', 'APIFY', 'TWILIO', 'GHL', 'HUBSPOT'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                    <Input
                      label="API Key"
                      type="password"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="Paste your key here"
                    />
                    <p className="text-[10px] text-[#505050]">
                      Keys are encrypted with AES-256 before storage. You can skip this step and add keys later from Settings.
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-[#A8A8A8]">
                      You're all set! Head to the Sources page to import your first leads — upload a CSV, connect Apollo, or run a scraper.
                    </p>
                    <div className="rounded-lg p-3" style={{ background: '#181818', border: '1px solid #2a2a2a' }}>
                      <div className="text-xs font-semibold text-[#F2F2F2] mb-2">Quick actions:</div>
                      <ul className="text-xs text-[#505050] flex flex-col gap-1.5">
                        <li>→ Sources → CSV Upload to import existing contacts</li>
                        <li>→ Sources → Integrations to connect Apollo or HubSpot</li>
                        <li>→ Dashboard → Area Runner to pull leads by region</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  {step > 1 && (
                    <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="flex-1 justify-center">Back</Button>
                  )}
                  <Button loading={saving} onClick={completeStep} className="flex-1 justify-center">
                    {step === 3 ? 'Go to Dashboard' : step === 2 && !apiKey ? 'Skip' : 'Continue'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
