import axios, { AxiosResponse } from 'axios'
import { getAuthHeader, getValidToken } from './session'
import TwoPi from '../twoPi'

const initialConfig = async (twoPi: TwoPi): Promise<{ headers: {} }> => {
  const token = await getValidToken(twoPi)

  return {
    headers: getAuthHeader(token)
  }
}

export const get = async (twoPi: TwoPi, path: string): Promise<AxiosResponse> => {
  const config = await initialConfig(twoPi)

  return await axios.get(`${twoPi.endpoint}/${path}`, config)
}

export const post = async (twoPi: TwoPi, path: string, data: {}): Promise<AxiosResponse> => {
  const config = await initialConfig(twoPi)

  return await axios.post(`${twoPi.endpoint}/${path}`, data, config)
}
