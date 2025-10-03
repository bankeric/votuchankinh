import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div className='min-h-screen flex items-center justify-center '>
      <div className='max-w-md w-full bg-[#efe0bd] rounded-lg shadow-md p-8 text-center'>
        <div className='mb-6'>
          <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4'>
            <svg
              className='h-8 w-8 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-[#991b1b] mb-2'>
            Payment Successful!
          </h1>
          <p className='text-gray-600'>
            Your payment has been processed successfully. Thank you for your
            purchase!
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            href='/'
            className='w-full bg-[#991b1b] text-white py-3 px-4 rounded-lg transition-colors inline-block'
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
