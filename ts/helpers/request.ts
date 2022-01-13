import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { getAuthHeader, getValidToken } from './session'
import TwoPi from '../twoPi'

const initialConfig = async (
  twoPi:        TwoPi,
  validStatus?: number | undefined
): Promise<AxiosRequestConfig<Record<string, unknown>>> => {
  const config: { [attribute: string]: unknown } = {}

  if (validStatus) {
    config['validateStatus'] = validateStatus(validStatus)
  }

  if (twoPi.apiKey && twoPi.apiSecret) {
    const token = await getValidToken(twoPi)

    config['headers'] = getAuthHeader(token)
  } else {
    return {}
  }

  return config
}

const validateStatus = (expected: number) => {
  return (status: number) => status < 400 || status === expected
}

export const get = async (
  twoPi:  TwoPi,
  path:   string,
  params: Record<string, unknown> | undefined
): Promise<AxiosResponse> => {
  const config = await initialConfig(twoPi)

  return await axios.get(`${twoPi.endpoint}/${path}`, { ...config, params })
}

export const post = async (
  twoPi:        TwoPi,
  path:         string,
  data:         Record<string, unknown>,
  validStatus?: number | undefined
): Promise<AxiosResponse> => {
  const config = await initialConfig(twoPi, validStatus)

  return await axios.post(`${twoPi.endpoint}/${path}`, data, config)
}
