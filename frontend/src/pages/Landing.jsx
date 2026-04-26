import { Link } from 'react-router-dom'
import { ArrowRight, Database, Zap, BarChart2, Shield, Globe, Mail, Phone, MessageSquare, Check } from 'lucide-react'

const FEATURES = [
  { icon: Globe, title: 'Multi-source lead import', desc: 'CSV, Apollo, HubSpot, Apify, LinkedIn scrapers and any REST API — all in one place.' },
  { icon: Zap, title: 'Automated outreach campaigns', desc: 'Build multi-step sequences with email, WhatsApp, calls, and meeting links.' },
  { icon: BarChart2, title: 'Area Runner', desc: 'Target leads by region, city, industry, and company size. Run all sources simultaneously.' },
  { icon: Shield, title: 'AES-256 key vault', desc: 'All credentials encrypted before storage. Raw keys never logged or returned.' },
  { icon: Mail, title: '6+ calling providers', desc: 'Twilio, Exotel, Plivo, VAPI, Knowlarity, Servetel — switch any time.' },
  { icon: Database, title: 'Custom API connector', desc: 'Connect any REST API without writing code. Map fields, configure pagination, schedule runs.' },
]

const TESTIMONIALS = [
  { name: 'Arjun K.', role: 'Sales Head, Zenwave Tech', text: 'LeadFlow replaced 3 separate tools. We went from 200 to 3000 qualified leads in a month.' },
  { name: 'Priya M.', role: 'Founder, SaaSly', text: 'The Area Runner is genuinely impressive. We run it for Mumbai and Delhi every week.' },
  { name: 'Rohan D.', role: 'CEO, NovaSpark', text: 'Setting up calling with Exotel took 5 minutes. Campaign automation saved 20 hours a week.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4" style={{ borderBottom: '1px solid #1e1e1e' }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg text-white font-bebas text-base"
            style={{ background: 'linear-gradient(135deg, #FF6B1A, #E63946)' }}>L</div>
          <span className="font-bebas text-xl tracking-wide text-gradient">LeadFlow</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/pricing" className="text-xs text-[#A8A8A8] hover:text-[#F2F2F2] transition-colors">Pricing</Link>
          <Link to="/login" className="text-xs text-[#A8A8A8] hover:text-[#F2F2F2] transition-colors">Sign in</Link>
          <Link to="/register">
            <button className="btn-primary text-xs py-1.5 px-4">Get started free</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-20 pb-16">
        <div className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6"
          style={{ background: 'rgba(255,107,26,0.12)', border: '1px solid rgba(255,107,26,0.25)', color: '#FF6B1A' }}>
          Lead generation & outreach automation
        </div>
        <h1 className="font-bebas text-6xl md:text-8xl text-gradient mb-4 max-w-4xl leading-none">
          Find leads. Reach them automatically.
        </h1>
        <p className="text-sm text-[#A8A8A8] max-w-xl mb-8 leading-relaxed">
          LeadFlow pulls leads from Apollo, LinkedIn, IndiaMart, JustDial and any API you connect — then automates email, WhatsApp, calls, and meeting booking in a single sequence.
        </p>
        <div className="flex items-center gap-3">
          <Link to="/register">
            <button className="btn-primary px-6 py-2.5">
              Start free — 500 leads <ArrowRight size={14} />
            </button>
          </Link>
          <Link to="/pricing">
            <button className="btn-secondary px-6 py-2.5">View pricing</button>
          </Link>
        </div>
        <p className="text-xs text-[#505050] mt-4">No credit card required · Free forever up to 500 leads</p>
      </section>

      {/* Features */}
      <section className="px-8 py-16" style={{ borderTop: '1px solid #1e1e1e' }}>
        <h2 className="font-bebas text-4xl text-center text-[#F2F2F2] mb-10">Everything in one platform</h2>
        <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 transition-all hover:border-[rgba(255,107,26,0.25)]">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,107,26,0.12)', border: '1px solid rgba(255,107,26,0.2)', color: '#FF6B1A' }}>
                <Icon size={16} />
              </div>
              <div className="font-semibold text-sm text-[#F2F2F2] mb-1">{title}</div>
              <div className="text-xs text-[#505050] leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Channels */}
      <section className="px-8 py-16" style={{ borderTop: '1px solid #1e1e1e', background: '#080808' }}>
        <h2 className="font-bebas text-4xl text-center text-[#F2F2F2] mb-3">Every outreach channel</h2>
        <p className="text-xs text-center text-[#505050] mb-10">Your choice of provider — switch any time without changing your campaigns</p>
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: Mail, label: 'Email', providers: ['Gmail', 'Mailgun', 'SendGrid', 'Any SMTP'] },
            { icon: Phone, label: 'Calling', providers: ['Twilio', 'Exotel', 'Plivo', 'VAPI', '+2 more'] },
            { icon: MessageSquare, label: 'WhatsApp', providers: ['WATI', 'Interakt', 'Gupshup', '360dialog'] },
            { icon: BarChart2, label: 'Meetings', providers: ['Calendly', 'Cal.com', 'Google Calendar'] },
          ].map(({ icon: Icon, label, providers }) => (
            <div key={label} className="card p-4 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 text-[#FF6B1A]"
                style={{ background: 'rgba(255,107,26,0.12)', border: '1px solid rgba(255,107,26,0.2)' }}>
                <Icon size={18} />
              </div>
              <div className="font-semibold text-sm text-[#F2F2F2] mb-2">{label}</div>
              {providers.map(p => (
                <div key={p} className="text-[10px] text-[#505050] leading-relaxed">{p}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-16" style={{ borderTop: '1px solid #1e1e1e' }}>
        <h2 className="font-bebas text-4xl text-center text-[#F2F2F2] mb-10">Trusted by sales teams</h2>
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {TESTIMONIALS.map(({ name, role, text }) => (
            <div key={name} className="card p-5">
              <p className="text-xs text-[#A8A8A8] leading-relaxed mb-4">"{text}"</p>
              <div className="font-semibold text-xs text-[#F2F2F2]">{name}</div>
              <div className="text-[10px] text-[#505050]">{role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center py-20 px-4" style={{ borderTop: '1px solid #1e1e1e' }}>
        <h2 className="font-bebas text-5xl text-gradient mb-3">Ready to scale your outreach?</h2>
        <p className="text-sm text-[#505050] mb-8">Join thousands of sales teams automating lead generation with LeadFlow.</p>
        <Link to="/register">
          <button className="btn-primary px-8 py-3 text-sm">
            Get started free <ArrowRight size={14} />
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between px-8 py-5 text-xs text-[#505050]"
        style={{ borderTop: '1px solid #1e1e1e' }}>
        <span>© 2026 LeadFlow. All rights reserved.</span>
        <div className="flex gap-4">
          <Link to="/pricing" className="hover:text-[#A8A8A8] transition-colors">Pricing</Link>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </footer>
    </div>
  )
}
