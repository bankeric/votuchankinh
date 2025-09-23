import NextAuth from 'next-auth'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'
import TikTok from 'next-auth/providers/tiktok'
import Instagram from 'next-auth/providers/instagram'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Facebook, Google, TikTok, Instagram],
  callbacks: {
    async session({ session, token }) {
      console.log('session', session, token)
      if (token) {
        session.user.id = token.sub as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    }
  }
})
