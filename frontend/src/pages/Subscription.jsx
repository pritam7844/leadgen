import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import api from '../api/axios'
import { Button } from '../components/ui/Button'

export default function Subscription() {
  const [plans, setPlans] = useState([])

  useEffect(() => {
    api.get('/subscription/plans').then(r => setPlans(r.data.data)).catch(() => {
      setPlans([
        { name: 'FREE', price: 0, currency: 'INR', leadsLimit: 500, features: ['CSV upload', '1 integration', 'Basic email'] },
        { name: 'PRO', price: 2999, currency: 'INR', leadsLimit: -1, features: ['Unlimited leads', 'All integrations', 'All calling providers', 'All WhatsApp providers', 'Campaigns', 'Team members'] },
        { name: 'ENTERPRISE', price: 9999, currency: 'INR', leadsLimit: -1, features: ['Everything in Pro', 'White-label', 'Dedicated scraper', 'Priority support', 'Custom limits'] },
      ])
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: '#0a0a0a' }}>
      <Link to="/" className="flex items-center gap-2 mb-10">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl text-white font-bebas text-xl"
          style={{ background: 'linear-gradient(135deg, #FF6B1A, #E63946)' }}>L</div>
        <span className="font-bebas text-2xl tracking-wide text-gradient">LeadFlow</span>
      </Link>

      <h1 className="font-bebas text-5xl text-gradient mb-2">Simple pricing</h1>
      <p className="text-sm text-[#505050] mb-12">Start free. Scale when you're ready.</p>

      <div className="grid grid-cols-3 gap-4 max-w-4xl w-full">
        {plans.map((plan) => (
          <div key={plan.name} className="card p-6 flex flex-col"
            style={plan.name === 'PRO' ? { border: '1px solid rgba(255,107,26,0.4)', background: '#141414' } : {}}>
            {plan.name === 'PRO' && (
              <div className="text-[9px] font-bold uppercase tracking-wider text-center py-1 px-3 rounded-full mb-4 self-center"
                style={{ background: 'rgba(255,107,26,0.15)', color: '#FF6B1A', border: '1px solid rgba(255,107,26,0.3)' }}>
                Most popular
              </div>
            )}
            <div className="font-bebas text-2xl text-[#F2F2F2] mb-2">{plan.name}</div>
            <div className="font-bebas text-5xl text-gradient mb-1">
              {plan.price === 0 ? 'Free' : `₹${plan.price}`}
            </div>
            {plan.price > 0 && <div className="text-xs text-[#505050] mb-5">per month</div>}
            {plan.price === 0 && <div className="h-5 mb-5" />}

            <ul className="flex flex-col gap-2.5 flex-1 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-[#A8A8A8]">
                  <Check size={12} className="text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/register">
              <Button variant={plan.name === 'PRO' ? 'primary' : 'secondary'} className="w-full justify-center">
                {plan.price === 0 ? 'Get started free' : `Start ${plan.name}`}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
