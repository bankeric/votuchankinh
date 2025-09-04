import { Metadata } from 'next'
import { Html, Head, Main, NextScript } from 'next/document'

export const metadata: Metadata = {
  title: 'Vô Tự Chân Kinh — The Wordless Sutra',
  description:
    'An immersive, minimalist landing page inspired by the aesthetics of Mogao Cave Sutras and classical Buddhist scrolls.',
}

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
