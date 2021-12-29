import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { getAuthHeader, getValidToken } from './session'
import TwoPi from '../twoPi'

const initialConfig = async (
  twoPi: TwoPi
): Promise<AxiosRequestConfig<Record<string, unknown>>> => {
  if (twoPi.apiKey && twoPi.apiSecret) {
    const token = await getValidToken(twoPi)

    return {
      headers: getAuthHeader(token)
    }
  } else {
    return {}
  }
}

export const get = async (
  twoPi: TwoPi,
  path:  string
): Promise<AxiosResponse> => {
  const config = await initialConfig(twoPi)

  return await axios.get(`${twoPi.endpoint}/${path}`, config)
}

export const post = async (
  twoPi: TwoPi,
  path:  string,
  data:  Record<string, unknown>
): Promise<AxiosResponse> => {
  const config = await initialConfig(twoPi)

  return await axios.post(`${twoPi.endpoint}/${path}`, data, config)
}
