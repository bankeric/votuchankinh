'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/service/auth'
import { appToast } from '@/lib/toastify'
import { signIn } from 'next-auth/react'
import { AuthProvider } from '@/interfaces/auth'
import { useAuthStore } from '@/store/auth'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      appToast('Passwords do not match', { type: 'error' })
      setIsLoading(false)
      return
    }

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      // Auto login after successful registration
      await login({
        email: formData.email,
        password: formData.password
      })
      router.push('/ai/new')
      appToast('Account created successfully!', {
        type: 'success'
      })
    } catch (error: any) {
      appToast(
        error.response?.data?.error ||
          'Failed to create account. Please try again.',
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

  const handleSocialSignIn = async (provider: AuthProvider) => {
    await signIn(provider, { callbackUrl: '/ai/new' })
  }

  return (
    <div className='min-h-screen bg-amber-50 dark:bg-gray-900 grid lg:grid-cols-2'>
      {/* Left Section - Signup Form */}
      <div className='flex flex-col justify-center px-8 lg:px-16 bg-[#f3ead7]'>
        {/* Back Button */}
        <button
          onClick={() => router.push('/landing')}
          className='absolute top-6 left-6 z-10 flex items-center space-x-2 text-gray-600 hover:text-red-800 transition-colors'
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          <span className='text-sm font-medium'>Back to Home</span>
        </button>

        {/* --------- */}
        <div className='max-w-md mx-auto w-full'>
          {/* Logo */}
          {/* <div className="mb-8 flex justify-center">
            <Image
              src="/images/giac-ngo-logo-1.png"
              alt="Giac Ngo Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div> */}

          {/* Title */}
          <h1 className='text-3xl font-bold text-red-800 mb-8 text-center'>
            Create your account
          </h1>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            <div className='space-y-2'>
              <Label
                htmlFor='name'
                className='text-black font-medium'
              >
                Full Name
              </Label>
              <Input
                id='name'
                name='name'
                type='text'
                required
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter your full name'
                className='bg-white border-2 border-black focus:border-red-800 text-black placeholder-gray-500'
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className='text-black font-medium'
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
                className='bg-white border-2 border-black focus:border-red-800 text-black placeholder-gray-500'
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='password'
                className='text-black font-medium'
              >
                Password
              </Label>
              <Input
                id='password'
                name='password'
                type='password'
                required
                value={formData.password}
                onChange={handleChange}
                placeholder='Create a password'
                className='bg-white border-2 border-black focus:border-red-800 text-black placeholder-gray-500'
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='confirmPassword'
                className='text-black font-medium'
              >
                Confirm Password
              </Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm your password'
                className='bg-white border-2 border-black focus:border-red-800 text-black placeholder-gray-500'
                disabled={isLoading}
              />
            </div>

            <Button
              type='submit'
              className='w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg font-medium transition-colors'
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Social Signup Buttons */}
          <div className='mt-8'>
            <p className='text-center text-sm text-gray-600 mb-4'>
              Or continue with
            </p>
            <div className='flex justify-center space-x-6'>
              <button
                type='button'
                className='flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity'
                onClick={() => handleSocialSignIn(AuthProvider.GOOGLE)}
              >
                <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200'>
                  <Image
                    src='/images/google.png'
                    alt='Google'
                    width={24}
                    height={24}
                  />
                </div>
                <span className='text-xs text-gray-600'>Google</span>
              </button>

              <button
                type='button'
                className='flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity'
                onClick={() => handleSocialSignIn(AuthProvider.FACEBOOK)}
              >
                <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200'>
                  <Image
                    src='/images/facebook.png'
                    alt='Facebook'
                    width={24}
                    height={24}
                  />
                </div>
                <span className='text-xs text-gray-600'>Facebook</span>
              </button>

              <button
                type='button'
                className='flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity'
                onClick={() => handleSocialSignIn(AuthProvider.TIKTOK)}
              >
                <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200'>
                  <Image
                    src='/images/tiktok.png'
                    alt='TikTok'
                    width={24}
                    height={24}
                  />
                </div>
                <span className='text-xs text-gray-600'>TikTok</span>
              </button>

              <button
                type='button'
                className='flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity'
                onClick={() => handleSocialSignIn(AuthProvider.INSTAGRAM)}
              >
                <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200'>
                  <Image
                    src='/images/instagram.png'
                    alt='Instagram'
                    width={24}
                    height={24}
                  />
                </div>
                <span className='text-xs text-gray-600'>Instagram</span>
              </button>
            </div>
          </div>

          {/* Sign in link */}
          <p className='text-center text-sm text-gray-700 mt-8'>
            Already have an account?{' '}
            <Link
              href='/auth/login'
              className='text-red-800 hover:text-red-900 font-medium transition-colors'
            >
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className='text-center text-xs text-gray-600 mt-6'>
            By continuing, you agree to our{' '}
            <Link
              href='/terms'
              className='text-red-800 hover:text-red-900'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='text-red-800 hover:text-red-900'
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Simple Logo */}
      <div className='hidden lg:flex overflow-hidden relative'>
        <Image
          src='/images/giac-ngo-logo-4.png'
          alt='Giac Ngo Logo'
          fill
          className='w-full h-full object-cover'
        />
      </div>
    </div>
  )
}
