import { useEffect, useState } from 'react'
import { Plus, Play, Pause, Trash2, Mail, Phone, MessageSquare, Clock, Calendar, BarChart2 } from 'lucide-react'
import { automationApi } from '../api/automationApi'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { formatRelative } from '../utils/formatters'
import toast from 'react-hot-toast'

const STEP_ICONS = { EMAIL: Mail, CALL: Phone, WHATSAPP: MessageSquare, WAIT: Clock, MEETING: Calendar }
const STEP_COLORS = {
  EMAIL: { bg: 'rgba(255,107,26,0.12)', color: '#FF6B1A' },
  CALL: { bg: 'rgba(46,204,113,0.12)', color: '#2ECC71' },
  WHATSAPP: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  WAIT: { bg: 'rgba(80,80,80,0.1)', color: '#505050' },
  MEETING: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
}

const STEP_TYPES = ['EMAIL', 'WAIT', 'CALL', 'WHATSAPP', 'MEETING']

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [steps, setSteps] = useState([{ stepType: 'EMAIL', delayHours: 0 }])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    automationApi.getCampaigns().then(r => setCampaigns(r.data.data)).catch(() => {})
  }, [])

  const addStep = () => setSteps(prev => [...prev, { stepType: 'EMAIL', delayHours: 24 }])
  const removeStep = (i) => setSteps(prev => prev.filter((_, idx) => idx !== i))
  const updateStep = (i, field, value) =>
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))

  const saveCampaign = async () => {
    if (!name.trim()) { toast.error('Campaign name required'); return }
    setSaving(true)
    try {
      await automationApi.createCampaign({ name, steps })
      const res = await automationApi.getCampaigns()
      setCampaigns(res.data.data)
      setShowCreate(false)
      setName('')
      setSteps([{ stepType: 'EMAIL', delayHours: 0 }])
      toast.success('Campaign created')
    } catch {
      toast.error('Failed to create campaign')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (campaign) => {
    const res = campaign.status === 'ACTIVE'
      ? await automationApi.pauseCampaign(campaign.id)
      : await automationApi.startCampaign(campaign.id)
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? res.data.data : c))
    toast.success(campaign.status === 'ACTIVE' ? 'Campaign paused' : 'Campaign started')
  }

  const deleteCampaign = async (id) => {
    await automationApi.deleteCampaign(id)
    setCampaigns(prev => prev.filter(c => c.id !== id))
    toast.success('Campaign deleted')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowCreate(true)}><Plus size={12} />New campaign</Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="card p-12 text-center">
          <BarChart2 size={32} className="mx-auto mb-3 text-[#505050]" />
          <div className="text-sm text-[#505050]">No campaigns yet. Create a multi-step outreach sequence.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="card p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#F2F2F2]">{campaign.name}</div>
                  <div className="text-[10px] text-[#505050] mt-0.5">{campaign.steps?.length || 0} steps · {campaign.leadIds?.length || 0} leads · Created {formatRelative(campaign.createdAt)}</div>
                </div>
                <Badge status={campaign.status} />
                <Button variant="secondary" size="sm" onClick={() => toggleStatus(campaign)}>
                  {campaign.status === 'ACTIVE' ? <><Pause size={11} />Pause</> : <><Play size={11} />Start</>}
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteCampaign(campaign.id)}>
                  <Trash2 size={11} />
                </Button>
              </div>

              {/* Steps */}
              <div className="flex items-center gap-2 flex-wrap">
                {(campaign.steps || []).map((step, i) => {
                  const Icon = STEP_ICONS[step.stepType] || Mail
                  const style = STEP_COLORS[step.stepType] || STEP_COLORS.EMAIL
                  return (
                    <div key={i} className="flex items-center gap-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold"
                        style={{ background: style.bg, color: style.color }}>
                        <Icon size={9} />
                        {step.stepType}
                      </div>
                      {i < campaign.steps.length - 1 && (
                        <span className="text-[10px] text-[#505050]">→ {step.delayHours}h</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Stats bar */}
              {campaign.stats && (
                <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #1e1e1e' }}>
                  {[
                    { label: 'Sent', value: campaign.stats.sent },
                    { label: 'Opened', value: campaign.stats.opened },
                    { label: 'Replied', value: campaign.stats.replied },
                    { label: 'Called', value: campaign.stats.called },
                    { label: 'Meetings', value: campaign.stats.meetings },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <div className="text-[11px] font-bold text-[#F2F2F2]">{value}</div>
                      <div className="text-[9px] text-[#505050]">{label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Campaign" width={560}>
        <div className="flex flex-col gap-4">
          <Input label="Campaign name" value={name} onChange={e => setName(e.target.value)} placeholder="Cold outreach — SaaS leads" />

          <div>
            <div className="label mb-2">Sequence steps</div>
            <div className="flex flex-col gap-2">
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[step.stepType] || Mail
                return (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#181818', border: '1px solid #2a2a2a' }}>
                    <div className="font-mono text-[10px] text-[#505050] w-5">{i + 1}</div>
                    <select value={step.stepType} onChange={e => updateStep(i, 'stepType', e.target.value)}
                      className="input-field text-[11px] py-1.5 flex-1">
                      {STEP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {i > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#505050]">After</span>
                        <input type="number" value={step.delayHours} min={0}
                          onChange={e => updateStep(i, 'delayHours', +e.target.value)}
                          className="input-field text-[11px] py-1.5 w-14 text-center" />
                        <span className="text-[10px] text-[#505050]">h</span>
                      </div>
                    )}
                    {steps.length > 1 && (
                      <button onClick={() => removeStep(i)} className="text-[#505050] hover:text-[#E63946] transition-colors p-1">
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            <button onClick={addStep} className="mt-2 text-[11px] font-semibold text-[#FF6B1A] hover:underline flex items-center gap-1">
              <Plus size={11} />Add step
            </button>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowCreate(false)} className="flex-1 justify-center">Cancel</Button>
            <Button loading={saving} onClick={saveCampaign} className="flex-1 justify-center">Create campaign</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
