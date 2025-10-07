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
        className="absolute top-6 left-6 z-10 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-800 dark:hover:text-red-400 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      {/* Left Section - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/giac-ngo-logo-1.png"
              alt="Giac Ngo Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-red-800 dark:text-red-400 mb-8 text-center">
            Sign in to your account
          </h1>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black dark:text-white font-medium">
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
                className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 focus:border-red-800 dark:focus:border-red-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-black dark:text-white font-medium">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-red-800 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
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
                className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 focus:border-red-800 dark:focus:border-red-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-800 dark:bg-red-700 hover:bg-red-900 dark:hover:bg-red-800 text-white py-3 rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Social Login Buttons */}
          <div className="mt-8">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              Or continue with
            </p>
            <div className="flex justify-center space-x-6">
              <button
                type="button"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
                onClick={() => handleSocialSignIn(AuthProvider.GOOGLE)}
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-600">
                  <Image
                    src="/images/google.png"
                    alt="Google"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Google</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
                onClick={() => handleSocialSignIn(AuthProvider.FACEBOOK)}
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-600">
                  <Image
                    src="/images/facebook.png"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Facebook</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
                onClick={() => handleSocialSignIn(AuthProvider.TIKTOK)}
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-600">
                  <Image
                    src="/images/tiktok.png"
                    alt="TikTok"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">TikTok</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
                onClick={() => handleSocialSignIn(AuthProvider.INSTAGRAM)}
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-600">
                  <Image
                    src="/images/instagram.png"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Instagram</span>
              </button>
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-8">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-red-800 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-6">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-red-800 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-red-800 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Animated Buddha Theme */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Gradient Background with Buddhist colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950">
          
          {/* Floating lotus petals */}
          <div className="absolute top-10 left-1/4 w-8 h-8 opacity-40 animate-float-slow">
            <svg viewBox="0 0 100 100" className="fill-orange-400 dark:fill-orange-600">
              <ellipse cx="50" cy="50" rx="30" ry="50" transform="rotate(0 50 50)" />
            </svg>
          </div>
          <div className="absolute top-32 right-1/3 w-10 h-10 opacity-30 animate-float-medium">
            <svg viewBox="0 0 100 100" className="fill-amber-400 dark:fill-amber-600">
              <ellipse cx="50" cy="50" rx="30" ry="50" transform="rotate(45 50 50)" />
            </svg>
          </div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 opacity-50 animate-float-fast">
            <svg viewBox="0 0 100 100" className="fill-yellow-400 dark:fill-yellow-600">
              <ellipse cx="50" cy="50" rx="30" ry="50" transform="rotate(90 50 50)" />
            </svg>
          </div>
          
          {/* Glowing orbs (representing enlightenment) */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-300/30 dark:bg-orange-700/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-300/30 dark:bg-amber-700/20 rounded-full blur-3xl animate-pulse-medium" />
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-yellow-300/30 dark:bg-yellow-700/20 rounded-full blur-3xl animate-pulse-fast" />
          
          {/* Dharma wheel particles */}
          <div className="absolute top-16 left-16 w-3 h-3 bg-orange-500/60 dark:bg-orange-700/60 rounded-full animate-spin-slow" />
          <div className="absolute top-24 right-24 w-4 h-4 bg-amber-500/60 dark:bg-amber-700/60 rounded-full animate-spin-medium" />
          <div className="absolute bottom-24 left-24 w-3 h-3 bg-yellow-500/60 dark:bg-yellow-700/60 rounded-full animate-spin-fast" />
          
          {/* Sacred geometry circles */}
          <div className="absolute top-1/3 right-1/4 w-32 h-32 border-2 border-orange-400/20 dark:border-orange-600/20 rounded-full animate-scale-pulse" />
          <div className="absolute bottom-1/3 left-1/4 w-40 h-40 border-2 border-amber-400/20 dark:border-amber-600/20 rounded-full animate-scale-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Main Logo Container with Buddhist aura effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Outer aura ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-4 border-orange-400/30 dark:border-orange-600/30 rounded-full animate-ping-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border-2 border-amber-400/40 dark:border-amber-600/40 rounded-full animate-ping-medium" />
            
            {/* Middle aura glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gradient-radial from-orange-400/10 to-transparent dark:from-orange-600/10 rounded-full animate-pulse" />
            
            {/* Main logo with floating animation */}
            <div className="relative animate-float-gentle">
              <Image
                src="/images/giac-ngo-logo-1.png"
                alt="Giac Ngo Logo"
                width={400}
                height={400}
                className="object-contain opacity-90 drop-shadow-2xl"
              />
            </div>
            
            {/* Inner sacred circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-yellow-400/30 dark:border-yellow-600/30 rounded-full animate-spin-very-slow" />
          </div>
        </div>
        
        {/* Mandala-inspired corner decorations */}
        <div className="absolute top-8 right-8 w-24 h-24 opacity-20">
          <svg viewBox="0 0 100 100" className="fill-none stroke-orange-600 dark:stroke-orange-400 stroke-2 animate-spin-slow">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="30" />
            <circle cx="50" cy="50" r="20" />
            <circle cx="50" cy="50" r="10" />
          </svg>
        </div>
        <div className="absolute bottom-8 left-8 w-24 h-24 opacity-20">
          <svg viewBox="0 0 100 100" className="fill-none stroke-amber-600 dark:stroke-amber-400 stroke-2 animate-spin-reverse-slow">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="30" />
            <circle cx="50" cy="50" r="20" />
            <circle cx="50" cy="50" r="10" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-40px) translateX(-15px) rotate(180deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-50px) translateX(20px) rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.45; }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.55; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-very-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes ping-slow {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          75%, 100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
        }
        
        @keyframes ping-medium {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          75%, 100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0; }
        }
        
        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        
        .animate-float-gentle {
          animation: float-gentle 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 10s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-fast {
          animation: float-fast 7s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-medium {
          animation: pulse-medium 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-medium {
          animation: spin-medium 15s linear infinite;
        }
        
        .animate-spin-fast {
          animation: spin-fast 10s linear infinite;
        }
        
        .animate-spin-very-slow {
          animation: spin-very-slow 30s linear infinite;
        }
        
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 25s linear infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-ping-medium {
          animation: ping-medium 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-scale-pulse {
          animation: scale-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}