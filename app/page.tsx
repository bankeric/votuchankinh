'use client'
import { useOnce } from '@/hooks/use-once'
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter()

  useOnce(() => {
    const pathname = window.location.pathname
    if (pathname === '/') {
      router.push(`/ai/new`)
    }
  }, [])

  return <></>
}
