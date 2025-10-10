'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function StoryPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id || 'c1'

  return (
    <main className='min-h-screen text-[#2c2c2c] bg-[#EFE0BD]'>
      <header className='sticky top-0 z-20 flex items-center justify-between p-4 bg-[#EFE0BD]/80 backdrop-blur-sm border-b border-[#8B4513]/10'>
        <Link
          href='/library'
          className='text-[#8B4513]/80 hover:text-[#8B4513] font-serif px-3 py-1 rounded-full border border-[#8B4513]/20 hover:border-[#8B4513]/40 bg-[#D4AF8C]/30'
        >
          ← Thư Viện
        </Link>
        <div className='font-serif text-sm text-[#8B4513]/70'>
          Câu Chuyện · {id.toString().toUpperCase()}
        </div>
      </header>

      <div className='max-w-5xl mx-auto p-4 md:p-8'>
        <div className='aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#8B4513]/20 bg-white'>
          <img
            src={`/images/${id}.png`}
            alt={`Story ${id}`}
            className='w-full h-full object-contain'
          />
        </div>
      </div>
    </main>
  )
}



