import { getBackEndUrl } from '@/configs/config'
import { LoginResponse } from '@/types'

import axios from 'axios'
const url = getBackEndUrl()

export const signIn = async (email: string, password: string) => {
  const response = await axios.post(`${url}/api/v1/sign-in`, {
    email,
    password
  })
  return response.data as LoginResponse
}

export const signUp = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${url}/api/v1/sign-up`, {
    name,
    email,
    password
  })
  return response.data as LoginResponse
}

export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${url}/api/v1/request-password-reset`, {
    email
  })
  return response.data
}
