'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Globe, CheckCircle } from 'lucide-react'
import { useTranslations } from '@/hooks/use-translations'
import { Language } from '@/interfaces/chat'
import { authService } from '@/service/auth'
import { Label } from '../ui/label'
import Link from 'next/link'
import { Input } from '../ui/input'
import { appToast } from '@/lib/toastify'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: OnboardingModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { language, changeLanguage, t } = useTranslations()
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  )
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()
  const { login } = useAuthStore()

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang)
    changeLanguage(lang)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData)
      appToast('Welcome back', {
        type: 'success'
      })
      onClose()
    } catch (error: any) {
      appToast(
        error.response?.data?.error ||
          'Please check your credentials and try again.',
        {
          type: 'error'
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
      modal
    >
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto [&>button]:hidden bg-[#efe0bd]'>
        <DialogHeader className='text-center space-y-4 pb-6'>
          <div className='flex justify-center'>
            <Image
              src={'/images/giac-ngo-logo-1.png'}
              alt='logo'
              width={64}
              height={64}
            />
          </div>
          <DialogTitle className='text-2xl font-bold text-orange-900 text-center'>
            {t('auth.signIn')}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className='space-y-6'
        >
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-orange-800'
            >
              Email
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              required
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='border-orange-200 focus:border-orange-400'
              disabled={isLoading}
            />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='password'
                className='text-orange-800'
              >
                Password
              </Label>
              <Link
                href='/forgot-password'
                className='text-sm text-orange-600 hover:text-orange-700 font-light'
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id='password'
              name='password'
              type='password'
              required
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter your password'
              className='border-orange-200 focus:border-orange-400'
              disabled={isLoading}
            />
          </div>

          <Button
            data-test='login-button'
            type='submit'
            className='w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg'
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className='text-center text-sm text-orange-700/70 font-light'>
            Don't have an account?{' '}
            <Link
              href='/register'
              className='text-orange-600 hover:text-orange-700 font-medium'
            >
              Sign up
            </Link>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
