import { useAuthStore } from '../store/authStore'
import { useWorkspaceStore } from '../store/workspaceStore'

export function useWorkspace() {
  const user = useAuthStore(s => s.user)
  const { workspace, setWorkspace } = useWorkspaceStore()
  return { workspace, setWorkspace, workspaceId: user?.workspaceId }
}
