import { Loader2, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { useTranslations } from '@/hooks/use-translations'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { CreateFineTuningModelRequest } from '@/service/finetune'
import { useCallback, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'

interface FineTuneModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  model?: CreateFineTuningModelRequest
  loading?: boolean
  onConfirm?: (model: CreateFineTuningModelRequest) => void
}

export function FineTuneModal({
  open,
  onOpenChange,
  model,
  loading,
  onConfirm
}: FineTuneModalProps) {
  const { t } = useTranslations()
  const [currentModel, setCurrentModel] =
    useState<CreateFineTuningModelRequest>({
      name: '',
      description: '',
      base_model: '',
      status: 'pending',
      version: '1.0',
      language: 'vi'
    })

  useEffect(() => {
    if (model && open) {
      setCurrentModel(model)
    }
    if (!open) {
      setCurrentModel({
        name: '',
        description: '',
        base_model: '',
        status: 'pending',
        version: '1.0',
        language: 'vi'
      })
    }
  }, [model, open])

  const onConfirmModal = () => {
    if (onConfirm) {
      onConfirm(currentModel)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogTrigger asChild>
        <Button className='gap-2 bg-orange-500 hover:bg-orange-600'>
          <Plus className='w-4 h-4' />
          {t('admin.modelManagement.actions.addModel')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('admin.modelManagement.actions.addNewModel')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {/* Name */}
          <div>
            <Label htmlFor='name'>{t('admin.modelManagement.form.name')}</Label>
            <Input
              id='name'
              value={currentModel.name}
              onChange={(e) =>
                setCurrentModel((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder={t('admin.userManagement.form.namePlaceholder')}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor='description'>
              {t('admin.modelManagement.form.description')}
            </Label>
            <Input
              id='description'
              value={currentModel.description}
              onChange={(e) =>
                setCurrentModel((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              placeholder={t(
                'admin.modelManagement.form.descriptionPlaceholder'
              )}
            />
          </div>

          {/* Base Model */}
          <div>
            <Label htmlFor='baseModel'>
              {t('admin.modelManagement.form.baseModel')}
            </Label>
            <Input
              id='baseModel'
              value={currentModel.base_model}
              onChange={(e) =>
                setCurrentModel((prev) => ({
                  ...prev,
                  base_model: e.target.value
                }))
              }
              placeholder={t('admin.modelManagement.form.baseModelPlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor='status'>
              {t('admin.modelManagement.form.status')}
            </Label>
            <Select
              value={currentModel.status}
              onValueChange={(value: string) =>
                setCurrentModel((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pending'>
                  {t('admin.modelManagement.form.statusOptions.pending')}
                </SelectItem>
                <SelectItem value='active'>
                  {t('admin.modelManagement.form.statusOptions.active')}
                </SelectItem>
                <SelectItem value='deprecated'>
                  {t('admin.modelManagement.form.statusOptions.deprecated')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              {t('admin.modelManagement.actions.cancel')}
            </Button>
            <Button
              onClick={onConfirmModal}
              className='bg-orange-500 hover:bg-orange-600'
              disabled={loading}
            >
              {loading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                t('admin.modelManagement.actions.addModel')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
