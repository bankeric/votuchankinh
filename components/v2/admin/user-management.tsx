"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Plus, Save, Search, Crown, Edit3, Eye, GraduationCap, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useUserStore } from "@/store/users"
import { User, CreateUserDto, Role } from "@/interfaces/user"
import { useTranslation } from "react-i18next"

const roleConfig = {
  admin: {
    label: "Admin",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <Crown className="w-3 h-3" />,
    description: "Full access to all features",
  },
  contributor: {
    label: "Contributor",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: <Edit3 className="w-3 h-3" />,
    description: "Can edit Q&A and training data",
  },
  student: {
    label: "Student",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <GraduationCap className="w-3 h-3" />,
    description: "Use chatbot and answer questions",
  },
  viewer: {
    label: "Viewer",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: <Eye className="w-3 h-3" />,
    description: "Read-only access",
  },
}

export function UserManagement() {
  const { t } = useTranslation()
  
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
    getFilteredUsers,
  } = useUserStore()

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState<CreateUserDto>({
    name: "",
    email: "",
    password: "",
    role: Role.STUDENT,
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
    const role = value === "all" ? undefined : value as User["role"]
    setFilters({ role })
    fetchUsers({ ...filters, role })
  }

  const handleSortChange = (value: string) => {
    setFilters({ sortBy: value as any })
    fetchUsers({ ...filters, sortBy: value as any })
  }

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setPendingRoleChange(userId, newRole)
  }

  const saveRoleChange = async (userId: string) => {
    const newRole = pendingRoleChanges[userId]
    if (newRole) {
      await updateUserRole(userId, newRole)
    }
  }

  const cancelRoleChange = (userId: string) => {
    clearPendingRoleChange(userId)
  }

  const addUser = async () => {
    if (newUser.name && newUser.email && newUser.password) {
      await createUser(newUser)
      setNewUser({ name: "", email: "", password: "", role: Role.STUDENT })
      setIsAddUserOpen(false)
    }
  }

  const formatLastActive = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return t('admin.userManagement.table.justNow')
    if (minutes < 60) return t('admin.userManagement.table.minutesAgo', { minutes })
    if (hours < 24) return t('admin.userManagement.table.hoursAgo', { hours })
    return t('admin.userManagement.table.daysAgo', { days })
  }

  const formatJoinedDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString("vi-VN")
  }

  const filteredUsers = getFilteredUsers()

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">{t('admin.userManagement.stats.total')}</p>
              <p className="text-xl font-bold text-orange-600">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">{t('admin.userManagement.stats.admin')}</p>
              <p className="text-xl font-bold text-red-600">{stats.admin}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">{t('admin.userManagement.stats.contributor')}</p>
              <p className="text-xl font-bold text-orange-600">{stats.contributor}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">{t('admin.userManagement.stats.student')}</p>
              <p className="text-xl font-bold text-blue-600">{stats.student}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">{t('admin.userManagement.stats.viewer')}</p>
              <p className="text-xl font-bold text-gray-600">{stats.viewer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder={t('admin.userManagement.filters.searchPlaceholder')}
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filters.role || "all"} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('admin.userManagement.filters.roleFilter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.userManagement.filters.allRoles')}</SelectItem>
                <SelectItem value="admin">{t('admin.userManagement.form.roles.admin')}</SelectItem>
                <SelectItem value="contributor">{t('admin.userManagement.form.roles.contributor')}</SelectItem>
                <SelectItem value="student">{t('admin.userManagement.form.roles.student')}</SelectItem>
                <SelectItem value="viewer">{t('admin.userManagement.form.roles.viewer')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sortBy || "lastActive"} onValueChange={handleSortChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder={t('admin.userManagement.filters.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastActive">{t('admin.userManagement.filters.lastActive')}</SelectItem>
                <SelectItem value="name">{t('admin.userManagement.filters.name')}</SelectItem>
                <SelectItem value="email">{t('admin.userManagement.filters.email')}</SelectItem>
                <SelectItem value="role">{t('admin.userManagement.filters.role')}</SelectItem>
                <SelectItem value="joinedDate">{t('admin.userManagement.filters.joinedDate')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Add User Button */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4" />
              {t('admin.userManagement.actions.addUser')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.userManagement.actions.addNewUser')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('admin.userManagement.form.name')}</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={t('admin.userManagement.form.namePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="email">{t('admin.userManagement.form.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder={t('admin.userManagement.form.emailPlaceholder')}
                />
              </div>
              {/* password */}
              <div>
                <Label htmlFor="password">{t('admin.userManagement.form.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder={t('admin.userManagement.form.passwordPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="role">{t('admin.userManagement.form.role')}</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: User["role"]) => setNewUser((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t('admin.userManagement.form.roles.admin')}</SelectItem>
                    <SelectItem value="contributor">{t('admin.userManagement.form.roles.contributor')}</SelectItem>
                    <SelectItem value="student">{t('admin.userManagement.form.roles.student')}</SelectItem>
                    <SelectItem value="viewer">{t('admin.userManagement.form.roles.viewer')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  {t('admin.userManagement.actions.cancel')}
                </Button>
                <Button onClick={addUser} className="bg-orange-500 hover:bg-orange-600" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.userManagement.actions.addUser')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg border border-orange-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">{t('admin.userManagement.table.user')}</th>
                <th className="text-left p-4 font-medium text-gray-700">{t('admin.userManagement.table.email')}</th>
                <th className="text-left p-4 font-medium text-gray-700">{t('admin.userManagement.table.role')}</th>
                <th className="text-left p-4 font-medium text-gray-700">{t('admin.userManagement.table.lastActive')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('admin.userManagement.table.loading')}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const hasPendingChange = pendingRoleChanges[user.uuid]
                  const currentRole = hasPendingChange || user.role || Role.STUDENT
                  const roleConfiguration = roleConfig[currentRole as keyof typeof roleConfig] || roleConfig.student
                  return (
                    <tr key={user.uuid} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {(user.name || "")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">
                              {t('admin.userManagement.table.joined')} {formatJoinedDate(user.joined_date || user.created_at || new Date())}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-900">{user.email}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Select
                            disabled={user?.role === Role.ADMIN}
                            value={currentRole}
                            onValueChange={(value: User["role"]) => handleRoleChange(user.uuid, value)}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  {roleConfiguration.icon}
                                  <span>{t(`admin.userManagement.form.roles.${currentRole}`)}</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(roleConfig).map(([role, config]) => (
                                <SelectItem key={role} value={role}>
                                  <div className="flex items-center gap-2">
                                    {config.icon}
                                    <div>
                                      <p className="font-medium">{t(`admin.userManagement.form.roles.${role}`)}</p>
                                      <p className="text-xs text-gray-500">{t(`admin.userManagement.form.roleDescriptions.${role}`)}</p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {hasPendingChange  && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => saveRoleChange(user.uuid)}
                                className="h-6 px-2 bg-orange-500 hover:bg-orange-600"
                                disabled={loading}
                              >
                                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelRoleChange(user.uuid)}
                                className="h-6 px-2"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-900">
                          {user.last_active ? formatLastActive(user.last_active) : t('admin.userManagement.table.neverActive')}
                        </p>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>{t('admin.userManagement.table.noUsers')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <p>
          {t('admin.userManagement.table.showing', { count: filteredUsers.length, total: stats.total })}
        </p>
      </div>
    </div>
  )
}
