import { SpeechDebugger } from '@/components/speech-debug'
import { SpeechToTextDemo } from '@/components/speech-to-text-demo'

export default function SpeechDebugPage() {
  return (
    <div className='container mx-auto py-8'>
      <SpeechDebugger />
      <SpeechToTextDemo />
    </div>
  )
}
