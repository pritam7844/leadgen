import { useCallback, useEffect } from 'react'
import { useLeadStore } from '../store/leadStore'
import { leadApi } from '../api/leadApi'
import toast from 'react-hot-toast'

export function useLeads() {
  const { leads, total, stats, loading, filters, setLeads, setStats, setLoading, setFilters } = useLeadStore()

  const fetchLeads = useCallback(async (overrides = {}) => {
    setLoading(true)
    try {
      const params = { ...filters, ...overrides }
      const res = await leadApi.getLeads(params)
      const { content, totalElements } = res.data.data
      setLeads(content, totalElements)
    } catch (e) {
      toast.error('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [filters, setLeads, setLoading])

  const fetchStats = useCallback(async () => {
    try {
      const res = await leadApi.getStats()
      setStats(res.data.data)
    } catch {}
  }, [setStats])

  const deleteLead = useCallback(async (id) => {
    await leadApi.deleteLead(id)
    toast.success('Lead deleted')
    fetchLeads()
  }, [fetchLeads])

  const bulkDelete = useCallback(async (ids) => {
    await leadApi.bulkDelete(ids)
    toast.success(`${ids.length} leads deleted`)
    fetchLeads()
  }, [fetchLeads])

  const exportLeads = useCallback(async () => {
    const res = await leadApi.exportLeads()
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return { leads, total, stats, loading, filters, fetchLeads, fetchStats, deleteLead, bulkDelete, exportLeads, setFilters }
}
