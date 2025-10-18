'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Loader2, Trash2, Edit } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useFineTuneStore from '@/store/fine-tune'
import {
  CreateFineTuningModelRequest,
  FineTuningModel
} from '@/service/finetune'
import { useOnce } from '@/hooks/use-once'
import { FineTuneModal } from './fine-tune-modal'
import { Button } from '../ui/button'

export function ModelManagement() {
  const { t } = useTranslation()
  const { listModels, fetchModels, createModel, updateModel, deleteModel } =
    useFineTuneStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectedModel, setSelectedModel] = useState<FineTuningModel>()

  useOnce(() => {
    fetchModels()
  }, [])

  const addModel = async (model: CreateFineTuningModelRequest) => {
    setLoading(true)
    setError(null)
    try {
      await createModel(model)
      setOpenModal(false)
    } catch (error) {
      setError('Failed to add model')
    } finally {
      setLoading(false)
    }
  }

  const updateSelectedModel = async (model: CreateFineTuningModelRequest) => {
    if (!selectedModel) return
    setLoading(true)
    setError(null)
    try {
      await updateModel(selectedModel.uuid, model)
      setSelectedModel(undefined)
      setOpenModal(false)
    } catch (error) {
      setError('Failed to update model')
    } finally {
      setLoading(false)
    }
  }

  const onConfirmModal = (model: CreateFineTuningModelRequest) => {
    if (selectedModel) {
      updateSelectedModel(model)
    } else {
      addModel(model)
    }
  }

  const handleDelete = async (uuid: string) => {
    setLoading(true)
    setError(null)
    try {
      await deleteModel(uuid)
    } catch (error) {
      setError('Failed to delete model')
    } finally {
      setLoading(false)
    }
  }

  const onClickRow = (model: FineTuningModel) => {
    setSelectedModel(model)
    setOpenModal(true)
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
              <p className='text-xl font-bold text-orange-600'>{stats.total}</p>
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
          {/* <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder={t('admin.userManagement.filters.searchPlaceholder')}
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='pl-9'
            />
          </div> */}

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

        {/* Add User Button */}
        <FineTuneModal
          open={openModal}
          onOpenChange={setOpenModal}
          onConfirm={onConfirmModal}
          model={selectedModel}
        />
      </div>

      {/* User Table */}
      <div className='bg-white rounded-lg border border-orange-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            {/* Head */}
            <thead className='bg-orange-50 border-b border-orange-200'>
              <tr>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {t('admin.modelManagement.table.name')}
                </th>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {t('admin.modelManagement.table.description')}
                </th>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {t('admin.modelManagement.table.baseModel')}
                </th>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {t('admin.modelManagement.table.status')}
                </th>
                <th className='text-left p-4 font-medium text-gray-700'>
                  {t('admin.modelManagement.table.version')}
                </th>
                <th className='text-left p-4 font-medium text-gray-700'></th>
              </tr>
            </thead>

            {/* Body */}
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
              ) : listModels.length > 0 ? (
                listModels.map((model) => {
                  return (
                    <tr
                      key={model.uuid}
                      className='border-b border-gray-100 hover:bg-orange-50'
                    >
                      <td className='p-4'>
                        <p className='text-gray-900'>{model.name}</p>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-900'>{model.description}</p>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-900'>{model.base_model}</p>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-900'>{model.status}</p>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-900'>{model.version}</p>
                      </td>
                      {/* Delete button */}
                      <td className='p-4'>
                        <div className='flex gap-2'>
                          <Edit
                            className='cursor-pointer w-4 h-4'
                            onClick={() => onClickRow(model)}
                          />
                          <Trash2
                            className='text-red-600 hover:underline cursor-pointer w-4 h-4'
                            onClick={() => handleDelete(model.uuid)}
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
                    <p>{t('admin.modelManagement.table.noModels')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      <div className='flex justify-between items-center text-sm text-gray-500'>
        {/* <p>
          {t('admin.userManagement.table.showing', {
            count: filteredUsers.length,
            total: stats.total
          })}
        </p> */}
      </div>
    </div>
  )
}
