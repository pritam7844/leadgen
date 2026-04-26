import { formatDistanceToNow, format } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return '—'
  return format(new Date(date), 'MMM d, yyyy')
}

export const formatRelative = (date) => {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatNumber = (n) => {
  if (n == null) return '0'
  return new Intl.NumberFormat('en-IN').format(n)
}

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount)
}

export const statusBadge = (status) => {
  const map = {
    NEW: 'badge-new',
    CONTACTED: 'badge-contacted',
    MEETING_BOOKED: 'badge-booked',
    CONVERTED: 'badge-converted',
    DEAD: 'badge-dead',
    QUALIFIED: 'badge-contacted',
  }
  return map[status] || 'badge-new'
}

export const scoreColor = (score) => {
  if (score >= 80) return '#2ECC71'
  if (score >= 50) return '#F59E0B'
  return '#E63946'
}
