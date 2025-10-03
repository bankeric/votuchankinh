'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/service/auth'
import { appToast } from '@/lib/toastify'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authService.login(formData)
      const from = searchParams.get('from') || '/ai/new'
      router.push(from)
      appToast('Welcome back', {
        type: 'success'
      })
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
    <div className="bg-amber-50 border-2 border-black rounded-lg p-8">
      <div className='text-center mb-8'>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/giac-ngo-logo-1.png"
            alt="Giác Ngộ Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <h2 className='text-3xl font-bold text-red-800 mb-2'>
          Đăng nhập
        </h2>
        <p className='text-gray-700'>
          Sign in to continue your journey
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='space-y-6'
      >
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
            className='bg-white border-2 border-black focus:border-red-800'
            disabled={isLoading}
          />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label
              htmlFor='password'
              className='text-black font-medium'
            >
              Password
            </Label>
            <Link
              href='/forgot-password'
              className='text-sm text-red-800 hover:text-red-900 font-light'
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
            className='bg-white border-2 border-black focus:border-red-800'
            disabled={isLoading}
          />
        </div>

        <Button
          data-test='login-button'
          type='submit'
          className='w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg font-medium'
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className='text-center text-sm text-gray-700 font-light'>
          Don't have an account?{' '}
          <Link
            href='/register'
            className='text-red-800 hover:text-red-900 font-medium'
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
