import { useState, useCallback } from 'react'
import { sourceApi } from '../api/sourceApi'
import toast from 'react-hot-toast'

export function useSources() {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSources = useCallback(async () => {
    setLoading(true)
    try {
      const res = await sourceApi.getSources()
      setSources(res.data.data)
    } catch {
      toast.error('Failed to load sources')
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteSource = useCallback(async (id) => {
    await sourceApi.deleteSource(id)
    toast.success('Source deleted')
    fetchSources()
  }, [fetchSources])

  const runSource = useCallback(async (id) => {
    const res = await sourceApi.runSource(id)
    toast.success('Source run triggered')
    return res.data.data
  }, [])

  return { sources, loading, fetchSources, deleteSource, runSource }
}
