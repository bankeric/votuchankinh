import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely revokes a blob URL and calls cleanup function if exists
 * @param url - The blob URL to revoke
 */
export function revokeSafeBlobURL(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)

    // Call cleanup function if exists
    if ((window as any).__blobCleanupMap?.has(url)) {
      const cleanup = (window as any).__blobCleanupMap.get(url)
      cleanup?.()
      ;(window as any).__blobCleanupMap.delete(url)
    }
  }
}

export function createSafeBlobURL(blob: Blob, onCleanup?: () => void): string {
  const url = URL.createObjectURL(blob)

  // Store cleanup function for later use
  if (onCleanup) {
    // Use a weak map to store cleanup functions
    if (!(window as any).__blobCleanupMap) {
      ;(window as any).__blobCleanupMap = new Map()
    }
    ;(window as any).__blobCleanupMap.set(url, onCleanup)
  }

  return url
}

export function createSafeAudioElement(
  blob: Blob,
  onEnd?: () => void,
  onError?: (error: string) => void
): HTMLAudioElement {
  const audioUrl = createSafeBlobURL(blob)
  const audio = new Audio(audioUrl)

  audio.onended = () => {
    revokeSafeBlobURL(audioUrl)
    onEnd?.()
  }

  audio.onerror = () => {
    revokeSafeBlobURL(audioUrl)
    onError?.('Failed to play audio')
  }

  return audio
}

/**
 * Converts base64 string to blob
 * @param base64 - The base64 string
 * @param mimeType - The MIME type
 * @returns The blob
 */
export function base64ToBlob(
  base64: string,
  mimeType: string = 'audio/mpeg'
): Blob {
  const audioData = atob(base64)
  const audioArray = new Uint8Array(audioData.length)
  for (let i = 0; i < audioData.length; i++) {
    audioArray[i] = audioData.charCodeAt(i)
  }
  return new Blob([audioArray], { type: mimeType })
}
