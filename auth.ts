import NextAuth from 'next-auth'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'
import TikTok from 'next-auth/providers/tiktok'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Facebook, Google, TikTok]
})
