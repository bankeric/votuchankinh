# Buddha AI

## Overview
A Next.js application offering AI-powered wisdom and mindful guidance inspired by Buddhist teachings. The app features internationalization (English and Vietnamese), authentication via social providers (Facebook, Google, TikTok, Instagram), and Stripe payment integration.

## Project Structure
- `app/` - Next.js 15 App Router pages and API routes
  - `(auth)/` - Authentication-related pages
  - `ai/` - AI chat features
  - `api/` - API routes
  - `landing/` - Landing page
  - `payment/` - Payment pages
  - `stripe/` - Stripe checkout pages
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `service/` - Service layer (text-to-speech, etc.)
- `store/` - Zustand state management
- `locales/` - i18n translation files (en, vi)
- `styles/` - Global styles

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js (next-auth v5 beta)
- **Payments**: Stripe
- **UI Components**: Radix UI, shadcn/ui
- **i18n**: i18next with browser language detection

## Environment Variables
Required secrets (set in Replit Secrets):
- `AUTH_SECRET` - NextAuth.js secret for session encryption
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (optional)

OAuth providers (optional):
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
- `AUTH_FACEBOOK_ID` / `AUTH_FACEBOOK_SECRET`
- `AUTH_TIKTOK_ID` / `AUTH_TIKTOK_SECRET`
- `AUTH_INSTAGRAM_ID` / `AUTH_INSTAGRAM_SECRET`

## Running the Project
- **Development**: `npm run dev` (runs on port 5000)
- **Production**: `npm run build && npm run start`

## Recent Changes
- 2024-12-23: Configured for Replit environment
  - Set up Next.js to run on port 5000
  - Configured allowedDevOrigins for Replit proxy
  - Made Stripe integration optional (app runs without publishable key)
  - Set up AUTH_SECRET from SESSION_SECRET
