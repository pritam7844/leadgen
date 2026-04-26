import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import AppLayout from '../components/layout/AppLayout'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Leads from '../pages/Leads'
import Sources from '../pages/Sources'
import Campaigns from '../pages/Campaigns'
import Automation from '../pages/Automation'
import Settings from '../pages/Settings'
import Onboarding from '../pages/Onboarding'
import Subscription from '../pages/Subscription'

function ProtectedRoute({ children }) {
  const token = useAuthStore(s => s.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const token = useAuthStore(s => s.token)
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/pricing" element={<Subscription />} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/sources" element={<Sources />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/automation" element={<Automation />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
