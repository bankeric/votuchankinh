const BACK_END_URL = process.env.NEXT_PUBLIC_BACK_END_URL || ''

export const getBackEndUrl = () => {
  if (!BACK_END_URL) {
    throw new Error('BACK_END_URL is not defined')
  }
  return BACK_END_URL
}
