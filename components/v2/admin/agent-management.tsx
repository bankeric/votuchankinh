'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Plus,
  Save,
  Search,
  Crown,
  Edit3,
  Eye,
  GraduationCap,
  X,
  Loader2,
  Trash,
  EyeIcon,
  EyeClosedIcon,
  EyeOffIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/store/users'
import { User, CreateUserDto, Role } from '@/interfaces/user'
import { useTranslation } from 'react-i18next'
import { useAgentStore } from '@/store/agent'
import { Agent } from '@/interfaces/agent'
import { useTranslations } from '@/hooks/use-translations'

const roleConfig = {
  admin: {
    label: 'Admin',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <Crown className='w-3 h-3' />,
    description: 'Full access to all features'
  },
  contributor: {
    label: 'Contributor',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: <Edit3 className='w-3 h-3' />,
    description: 'Can edit Q&A and training data'
  },
  student: {
    label: 'Student',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <GraduationCap className='w-3 h-3' />,
    description: 'Use chatbot and answer questions'
  },
  viewer: {
    label: 'Viewer',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: <Eye className='w-3 h-3' />,
    description: 'Read-only access'
  }
}

export function AgentManagement() {
  const { t, language } = useTranslations()

  const {
    users,
    loading,
    error,
    stats,
    filters,
    pendingRoleChanges,
    setFilters,
    fetchUsers,
    fetchUserStats,
    createUser,
    updateUserRole,
    setPendingRoleChange,
    clearPendingRoleChange,
    getFilteredUsers
  } = useUserStore()

  const {
    agents,
    filteredAgents,
    searchAgents,
    searchTerm,
    deleteAgent,
    setSearchTerm,
    updateAgent
  } = useAgentStore()

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState<CreateUserDto>({
    name: '',
    email: '',
    password: '',
    role: Role.STUDENT
  })

  // Load data on component mount
  useEffect(() => {
    fetchUsers()
    fetchUserStats()
  }, [fetchUsers, fetchUserStats])

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (searchValue: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          fetchUsers({ ...filters, search: searchValue })
        }, 300) // 300ms delay
      }
    })(),
    [fetchUsers, filters]
  )

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    setFilters({ search: value })
    debouncedSearch(value)
  }

  const handleRoleFilterChange = (value: string) => {
    const role = value === 'all' ? undefined : (value as User['role'])
    setFilters({ role })
    fetchUsers({ ...filters, role })
  }

  const handleSortChange = (value: string) => {
    setFilters({ sortBy: value as any })
    fetchUsers({ ...filters, sortBy: value as any })
  }

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setPendingRoleChange(userId, newRole)
  }

  const saveRoleChange = async (userId: string) => {
    const newRole = pendingRoleChanges[userId]
    if (newRole) {
      await updateUserRole(userId, newRole)
    }
  }

  const handleUpdateAgentStatus = (agent: Agent) => {
    updateAgent(
      agent.uuid,
      {
        status: agent.status === 'active' ? 'inactive' : 'active'
      },
      language
    )
  }

  const formatJoinedDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('vi-VN')
  }

  return (
    <div className='space-y-6'>
      {/* Error Display */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-600'>{error}</p>
        </div>
      )}

      {/* Summary Bar */}
      {/* <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <div className='bg-white p-4 rounded-lg border border-orange-200'>
          <div className='flex items-center gap-2'>
            <Users className='w-5 h-5 text-orange-500' />
            <div>
              <p className='text-sm text-gray-600'>
                {t('admin.userManagement.stats.total')}
              </p>
              <p className='text-xl font-bold text-orange-600'>
                {agents.length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg border border-orange-200'>
          <div className='flex items-center gap-2'>
            <Crown className='w-5 h-5 text-red-500' />
            <div>
              <p className='text-sm text-gray-600'>
                {t('admin.userManagement.stats.admin')}
              </p>
              <p className='text-xl font-bold text-red-600'>{stats.admin}</p>
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg border border-orange-200'>
          <div className='flex items-center gap-2'>
            <Edit3 className='w-5 h-5 text-orange-500' />
            <div>
              <p className='text-sm text-gray-600'>
                {t('admin.userManagement.stats.contributor')}
              </p>
              <p className='text-xl font-bold text-orange-600'>
                {stats.contributor}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg border border-orange-200'>
          <div className='flex items-center gap-2'>
            <GraduationCap className='w-5 h-5 text-blue-500' />
            <div>
              <p className='text-sm text-gray-600'>
                {t('admin.userManagement.stats.student')}
              </p>
              <p className='text-xl font-bold text-blue-600'>{stats.student}</p>
            </div>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg border border-orange-200'>
          <div className='flex items-center gap-2'>
            <Eye className='w-5 h-5 text-gray-500' />
            <div>
              <p className='text-sm text-gray-600'>
                {t('admin.userManagement.stats.viewer')}
              </p>
              <p className='text-xl font-bold text-gray-600'>{stats.viewer}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Controls */}
      <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
        <div className='flex flex-col sm:flex-row gap-2 flex-1'>
          {/* Search */}
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder={t('admin.agentManagement.filters.searchPlaceholder')}
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-9'
            />
          </div>

          {/* Filters */}
          {/* <div className='flex gap-2'>
            <Select
              value={filters.role || 'all'}
              onValueChange={handleRoleFilterChange}
            >
              <SelectTrigger className='w-32'>
                <SelectValue
                  placeholder={t('admin.userManagement.filters.roleFilter')}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>
                  {t('admin.userManagement.filters.allRoles')}
                </SelectItem>
                <SelectItem value='admin'>
                  {t('admin.userManagement.form.roles.admin')}
                </SelectItem>
                <SelectItem value='contributor'>
                  {t('admin.userManagement.form.roles.contributor')}
                </SelectItem>
                <SelectItem value='student'>
                  {t('admin.userManagement.form.roles.student')}
                </SelectItem>
                <SelectItem value='viewer'>
                  {t('admin.userManagement.form.roles.viewer')}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy || 'lastActive'}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className='w-36'>
                <SelectValue
                  placeholder={t('admin.userManagement.filters.sortBy')}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='lastActive'>
                  {t('admin.userManagement.filters.lastActive')}
                </SelectItem>
                <SelectItem value='name'>
                  {t('admin.userManagement.filters.name')}
                </SelectItem>
                <SelectItem value='email'>
                  {t('admin.userManagement.filters.email')}
                </SelectItem>
                <SelectItem value='role'>
                  {t('admin.userManagement.filters.role')}
                </SelectItem>
                <SelectItem value='joinedDate'>
                  {t('admin.userManagement.filters.joinedDate')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </div>

      {/* User Table */}
      <div className='bg-white rounded-lg border border-orange-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-orange-50 border-b border-orange-200'>
              <tr>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {t('admin.agentManagement.table.name')}
                </th>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {t('admin.agentManagement.table.description')}
                </th>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {t('admin.agentManagement.table.status')}
                </th>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {t('admin.agentManagement.table.language')}
                </th>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {/* TODO: Action buttons */}{' '}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className='p-8 text-center'
                  >
                    <div className='flex items-center justify-center gap-2'>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      <span>{t('admin.userManagement.table.loading')}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => {
                  return (
                    <tr
                      key={agent.uuid}
                      className='border-b border-gray-100 hover:bg-orange-50'
                    >
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center'>
                            <span className='text-white font-medium text-sm'>
                              {(agent.name || '')
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className='font-medium text-gray-900'>
                              {agent.name}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {t('admin.userManagement.table.joined')}{' '}
                              {formatJoinedDate(
                                agent.created_at ||
                                  agent.created_at ||
                                  new Date()
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-900'>{agent.description}</p>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-900'>{agent.status}</p>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-900'>{agent.language}</p>
                      </td>
                      <td className='p-4'>
                        <div className='flex items-center gap-4'>
                          {agent.status === 'active' ? (
                            <EyeOffIcon
                              className='cursor-pointer text-gray-400 hover:text-gray-600'
                              onClick={() => handleUpdateAgentStatus(agent)}
                            />
                          ) : (
                            <EyeIcon
                              className='cursor-pointer text-gray-400 hover:text-gray-600'
                              onClick={() => handleUpdateAgentStatus(agent)}
                            />
                          )}

                          <Trash
                            className='cursor-pointer text-gray-400 hover:text-gray-600'
                            onClick={() => deleteAgent(agent.uuid)}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className='text-center py-8 text-gray-500'
                  >
                    <Users className='w-12 h-12 mx-auto mb-3 opacity-20' />
                    <p>{t('admin.userManagement.table.noUsers')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      <div className='flex justify-between items-center text-sm text-gray-500'>
        <p>
          {t('admin.userManagement.table.showing', {
            count: agents.length,
            total: agents.length // TODO: replace with total count from server
          })}
        </p>
      </div>
    </div>
  )
}
