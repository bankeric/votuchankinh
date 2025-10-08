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

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData)
      router.push('/ai/new')
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

  const handleSocialSignIn = async (provider: AuthProvider) => {
    await signIn(provider, { callbackUrl: '/ai/new' })
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex">
      {/* Back Button */}
      <button
        onClick={() => router.push('/landing')}
        className="absolute top-6 left-6 z-10 flex items-center space-x-2 text-gray-600 hover:text-red-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      {/* Left Section - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-[#f3ead7]">
        <div className="max-w-md mx-auto w-full">
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
          <h1 className="text-3xl font-bold text-red-800 mb-8 text-center">
            Sign in to your account
          </h1>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-white border-2 border-black focus:border-red-800 text-black placeholder-gray-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-black font-medium">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-red-800 hover:text-red-900 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="bg-white border-2 border-black focus:border-red-800 text-black placeholder-gray-500"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Social Login Buttons */}
          <div className="mt-8">
            <p className="text-center text-sm text-gray-600 mb-4">
              Or continue with
            </p>
            <div className="flex justify-center space-x-6">
              <button
                type="button"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
                onClick={() => handleSocialSignIn(AuthProvider.GOOGLE)}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                  <Image
                    src="/images/google.png"
                    alt="Google"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-xs text-gray-600">Google</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
                onClick={() => handleSocialSignIn(AuthProvider.FACEBOOK)}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                  <Image
                    src="/images/facebook.png"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
                onClick={() => handleSocialSignIn(AuthProvider.TIKTOK)}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                  <Image
                    src="/images/tiktok.png"
                    alt="TikTok"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-xs text-gray-600">TikTok</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
                onClick={() => handleSocialSignIn(AuthProvider.INSTAGRAM)}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                  <Image
                    src="/images/instagram.png"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-xs text-gray-600">Instagram</span>
              </button>
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-700 mt-8">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-red-800 hover:text-red-900 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-600 mt-6">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-red-800 hover:text-red-900">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-red-800 hover:text-red-900">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Simple Logo */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center translate-y-20">
          <Image
            src="/images/giac-ngo-logo-4.png"
            alt="Giac Ngo Logo"
            width={900}
            height={900}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}