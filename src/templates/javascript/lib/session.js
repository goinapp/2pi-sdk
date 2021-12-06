const axios = require('axios')
const store = require('./store')

const getAuthHeader = token => {
  return { 'Authorization': `Bearer ${token}` }
}

const init = async () => {
  const response = await axios.post(`${process.env.ENDPOINT}/v1/sessions`, {
    key:    process.env.API_KEY,
    secret: process.env.API_SECRET
  })

  if (response.status === 200) {
    const { token, valid_until: validUntil } = response.data.data

    store.set('token', { token, validUntil: new Date(validUntil) })

    return token
  } else {
    throw new Error(`Authentication failed, response status was ${response.status} (expecting 200)`)
  }
}

const refresh = async token => {
  const endpoint = process.env.ENDPOINT
  const config   = {
    headers: getAuthHeader(token)
  }

  const response = await axios.patch(`${endpoint}/v1/sessions`, {}, config)

  if (response.status === 200) {
    const { token, valid_until: validUntil } = response.data.data

    store.set('token', { token, validUntil: new Date(validUntil) })

    return token
  } else {
    throw new Error(`Authentication failed, response status was ${response.status} (expecting 200)`)
  }
}

const getValidToken = async () => {
  const refreshOffset         = 60 * 1000 // 1 minute
  const renewOffset           = 10 * 1000 // 10 seconds
  const now                   = new Date().getTime()
  const { token, validUntil } = store.get('token')    || {}
  const validTime             = validUntil?.getTime() || 0

  if (validTime - refreshOffset > now) {
    return token
  } else if (validTime - renewOffset > now) {
    return await refresh(token)
  } else {
    return await init()
  }
}

module.exports = { getAuthHeader, getValidToken }
