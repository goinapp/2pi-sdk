import axios, { AxiosResponse } from 'axios'
import routes from './routes.json'
import TwoPi from '../twoPi'

const store = new Map()

const saveToken = (response: AxiosResponse): string => {
  const { token, valid_until: validUntil } = response.data.data

  store.set('token', { token, validUntil: new Date(validUntil) })

  return token
}

const init = async (twoPi: TwoPi): Promise<string> => {
  const url      = `${twoPi.endpoint}/${routes.sessionsPath}`
  const response = await axios.post(url, {
    key:    twoPi.apiKey,
    secret: twoPi.apiSecret
  })

  if (response.status === 200) {
    return saveToken(response)
  } else {
    throw new Error(`Authentication failed, response status was ${response.status} (expecting 200)`)
  }
}

const refresh = async (twoPi: TwoPi, token: string): Promise<string> => {
  const url      = `${twoPi.endpoint}/${routes.sessionsPath}`
  const config   = { headers: getAuthHeader(token) }
  const response = await axios.patch(url, {}, config)

  if (response.status === 200) {
    return saveToken(response)
  } else {
    throw new Error(`Authentication failed, response status was ${response.status} (expecting 200)`)
  }
}

export const getValidToken = async (twoPi: TwoPi): Promise<string> => {
  const refreshOffset         = 60 * 1000 // 1 minute
  const renewOffset           = 10 * 1000 // 10 seconds
  const now                   = new Date().getTime()
  const { token, validUntil } = store.get('token')    || {}
  const validTime             = validUntil?.getTime() || 0

  if (validTime - refreshOffset > now) {
    return token
  } else if (validTime - renewOffset > now) {
    return await refresh(twoPi, token)
  } else {
    return await init(twoPi)
  }
}

export const getAuthHeader = (token: string): {'Authorization': string} => {
  return { 'Authorization': `Bearer ${token}` }
}
