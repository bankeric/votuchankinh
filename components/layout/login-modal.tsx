'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
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
import { signIn } from 'next-auth/react'
import { AuthProvider } from '@/interfaces/auth'

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
      window.location.reload()
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

  const handleSignIn = async (provider: AuthProvider) => {
    await signIn(provider)
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

        <DialogFooter>
          <div className='flex flex-col items-center w-full space-y-4 pt-4 border-t border-[#2c2c2c]/30 mt-4'>
            <p className='text-orange-700 text-sm'>Or continue with</p>
            <div className='flex justify-center space-x-4 w-full'>
              <Button
                type='button'
                variant='ghost'
                className='flex items-center space-x-2 hover:bg-black/10'
                onClick={() => handleSignIn(AuthProvider.FACEBOOK)}
              >
                <Image
                  src='/images/facebook.png'
                  alt='Facebook'
                  width={20}
                  height={20}
                />
                <span>Facebook</span>
              </Button>
              <Button
                type='button'
                variant='ghost'
                className='flex items-center space-x-2 hover:bg-black/10'
                onClick={() => handleSignIn(AuthProvider.GOOGLE)}
              >
                <Image
                  src='/images/google.png'
                  alt='Google'
                  width={20}
                  height={20}
                />
                <span>Google</span>
              </Button>
              <Button
                type='button'
                variant='ghost'
                className='flex items-center space-x-2 hover:bg-black/10'
                onClick={() => handleSignIn(AuthProvider.TIKTOK)}
              >
                <Image
                  src='/images/tiktok.png'
                  alt='TikTok'
                  width={20}
                  height={20}
                />
                <span>TikTok</span>
              </Button>
              <Button
                type='button'
                variant='ghost'
                className='flex items-center space-x-2 hover:bg-black/10'
                onClick={() => handleSignIn(AuthProvider.INSTAGRAM)}
              >
                <Image
                  src='/images/instagram.png'
                  alt='Instagram'
                  width={20}
                  height={20}
                />
                <span>Instagram</span>
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
