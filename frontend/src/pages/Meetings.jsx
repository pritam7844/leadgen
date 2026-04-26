import React, { useState } from 'react'
import { Calendar, Link as LinkIcon, Plus, CheckCircle2, Clock, Globe, ArrowRight } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'

const providers = [
  { id: 'calendly', name: 'Calendly', icon: 'https://assets.calendly.com/assets/frontend/media/calendly-logo-7e0e7a1.png', status: 'connected', color: '#006BFF' },
  { id: 'calcom', name: 'Cal.com', icon: 'https://cal.com/logo.svg', status: 'not_connected', color: '#000000' },
  { id: 'google', name: 'Google Calendar', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg', status: 'not_connected', color: '#4285F4' },
]

const recentMeetings = [
  { id: 1, lead: 'John Doe', company: 'TechCorp', time: 'Today, 2:00 PM', duration: '30 min', type: 'Intro Call', status: 'confirmed' },
  { id: 2, lead: 'Sarah Smith', company: 'Global Web', time: 'Tomorrow, 10:30 AM', duration: '45 min', type: 'Demo', status: 'pending' },
  { id: 3, lead: 'Michael Brown', company: 'DesignCo', time: 'Apr 28, 4:00 PM', duration: '15 min', type: 'Follow up', status: 'confirmed' },
]

export default function Meetings() {
  const [connecting, setConnecting] = useState(null)

  const handleConnect = (name) => {
    setConnecting(name)
    setTimeout(() => {
      setConnecting(null)
      toast.success(`${name} connected successfully!`)
    }, 1500)
  }

  return (
    <div className="flex-1 overflow-auto bg-[#0A0A0A] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bebas tracking-wider text-[#F2F2F2] mb-2">Meetings & Scheduling</h1>
            <p className="text-[#A8A8A8] text-xs max-w-md">Connect your favorite booking tools and automate meeting scheduling with your leads.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#FF6B1A] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#E63946] transition-all shadow-lg shadow-[#FF6B1A]/10">
            <Plus size={14} /> Create Booking Link
          </button>
        </header>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {providers.map((p) => (
            <div key={p.id} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#FF6B1A]/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#181818] flex items-center justify-center p-2 border border-[#2a2a2a]">
                  <img src={p.icon} alt={p.name} className="w-full h-full object-contain" />
                </div>
                {p.status === 'connected' ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded-full border border-[#10b981]/20">
                    <CheckCircle2 size={10} /> Connected
                  </span>
                ) : (
                  <button 
                    onClick={() => handleConnect(p.name)}
                    disabled={connecting === p.name}
                    className="text-[10px] font-bold text-[#A8A8A8] hover:text-[#F2F2F2] transition-colors"
                  >
                    {connecting === p.name ? 'Connecting...' : 'Connect Now'}
                  </button>
                )}
              </div>
              <h3 className="text-[#F2F2F2] text-sm font-bold mb-1">{p.name}</h3>
              <p className="text-[#505050] text-[10px] mb-4">Sync your availability and booking page instantly.</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-5 h-5 rounded-full border border-[#111111] bg-[#222222]" />
                  ))}
                </div>
                <ArrowRight size={14} className="text-[#505050] group-hover:text-[#FF6B1A] transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Meetings */}
          <div className="lg:col-span-2">
            <h2 className="text-[#F2F2F2] text-sm font-bebas tracking-widest mb-6 flex items-center gap-2">
              <Calendar size={14} className="text-[#FF6B1A]" /> Upcoming Sessions
            </h2>
            <div className="space-y-3">
              {recentMeetings.map((m) => (
                <div key={m.id} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 flex items-center justify-between hover:bg-[#141414] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B1A] to-[#E63946] flex items-center justify-center text-white font-bold text-sm">
                      {m.lead[0]}
                    </div>
                    <div>
                      <h4 className="text-[#F2F2F2] text-xs font-bold">{m.lead}</h4>
                      <p className="text-[#505050] text-[10px]">{m.company} · {m.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#A8A8A8] text-[10px] mb-0.5">
                        <Clock size={10} /> {m.time}
                      </div>
                      <div className="text-[#505050] text-[9px]">{m.duration} duration</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-tighter ${
                      m.status === 'confirmed' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'
                    }`}>
                      {m.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats/Settings */}
          <div>
            <h2 className="text-[#F2F2F2] text-sm font-bebas tracking-widest mb-6 flex items-center gap-2">
               <Globe size={14} className="text-[#FF6B1A]" /> Personal Info
            </h2>
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6">
              <div className="mb-6">
                <label className="text-[#505050] text-[10px] font-bold uppercase mb-2 block">Primary Timezone</label>
                <div className="bg-[#0A0A0A] border border-[#1e1e1e] rounded p-2.5 text-[#F2F2F2] text-xs flex items-center justify-between">
                  (GMT+05:30) Asia/Kolkata
                  <ArrowRight size={10} className="text-[#505050]" />
                </div>
              </div>
              <div className="mb-6">
                <label className="text-[#505050] text-[10px] font-bold uppercase mb-2 block">Total Meetings (Monthly)</label>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bebas text-[#FF6B1A]">12</span>
                  <span className="text-[#505050] text-[10px]">/ 50 limit</span>
                </div>
                <div className="w-full bg-[#1e1e1e] h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#FF6B1A] h-full" style={{ width: '24%' }} />
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#2a2a2a] rounded-lg text-[#A8A8A8] text-xs font-bold hover:text-[#F2F2F2] hover:bg-[#181818] transition-all">
                <LinkIcon size={12} /> View Public Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
