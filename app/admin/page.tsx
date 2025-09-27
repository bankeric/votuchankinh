'use client'

import { AdminPanel } from '@/components/v2/admin/admin-panel'
import { useOnce } from '@/hooks/use-once'
import { Role } from '@/interfaces/user'
import { useAuthStore } from '@/store/auth'

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()
  useOnce(() => {
    if (isAuthenticated !== undefined && (!user || user.role !== Role.ADMIN)) {
      window.location.href = '/ai/new'
    }
  }, [user, isAuthenticated])
  return <AdminPanel />
}
