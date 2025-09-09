import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { signUp } from '@/services/authService'
import { useRouter } from 'next/navigation'

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      await signUp(name, email, password)
      // Redirect to login page or another page after successful registration
      router.push('/login')
    } catch (err: unknown) {
      console.error(err)
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match')
    } else {
      setError('')
    }
  }, [confirmPassword, password])
  return (
    <>
      <Head>
        <title>Register - Giac.Ngo</title>
      </Head>
      <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <Image
            className='mx-auto h-12 w-auto'
            src='/images/logo.png'
            alt='Your logo'
            width={48}
            height={48}
          />
          <h2 className='mt-6 text-center text-3xl text-text-primary'>
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{' '}
            <Link
              href='/login'
              className=' text-text-primary font-bold :hover:underline'
            >
              login to your account
            </Link>
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-[#ddc68d] py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            {error && (
              <div className='mb-4 bg-red-50 border-l-4 border-red-400 p-4'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-red-700'>{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form
              className='space-y-6'
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-text-primary'
                >
                  Full Name
                </label>
                <div className='mt-1'>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    autoComplete='name'
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm text-black'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-text-primary'
                >
                  Email address
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm text-black'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-text-primary'
                >
                  Password
                </label>
                <div className='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-border-primary  rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm text-black'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='confirm-password'
                  className='block text-sm font-medium text-text-primary'
                >
                  Confirm Password
                </label>
                <div className='mt-1'>
                  <input
                    id='confirm-password'
                    name='confirm-password'
                    type='password'
                    autoComplete='current-password'
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='appearance-none block w-full px-3 py-2 border border-border-primary  rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm text-black'
                  />
                </div>
              </div>

              {/* <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 border-border-primary rounded text-black'
                    onChange={(e) => setIsRememberMe(e.target.checked)}
                    value={isRememberMe ? 'true' : 'false'}
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-text-primary'
                  >
                    Remember me
                  </label>
                </div>

                <div className='text-sm'>
                  <Link
                    href='/forgot-password'
                    className='font-medium text-text-primary hover:underline'
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div> */}

              <div>
                <button
                  type='submit'
                  disabled={isLoading || !!error}
                  className='w-full flex justify-center py-2 px-4 border border-transparent cursor-pointer rounded-md shadow-sm text-sm font-medium text-white bg-bg-btn-primary focus:outline-none disabled:opacity-50'
                >
                  {isLoading ? 'Create Account ...' : 'Create Account'}
                </button>
              </div>

              {/* If users already have an account */}
              <div>
                <p className='mt-2 text-center text-sm text-gray-600'>
                  Already have an account?{' '}
                  <Link
                    href='/login'
                    className='font-medium text-text-primary hover:underline'
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>

            {/* <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-border-primary' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-[#ddc68d] text-text-primary'>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-2 gap-3'>
                <div>
                  <button className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'>
                    <span className='sr-only'>Sign in with Google</span>
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z' />
                    </svg>
                  </button>
                </div>

                <div>
                  <button className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'>
                    <span className='sr-only'>Sign in with Facebook</span>
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path
                        fillRule='evenodd'
                        d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
