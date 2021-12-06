import config from '../config.json'

const getEndpoint = (devMode = false) => {
  const { protocol, hostname, port } = getEndpointData(devMode)
  const hasDefaultPort               =
    (protocol === 'https' && port === 443) ||
    (protocol === 'http' && port === 80)

  if (hasDefaultPort) {
    return `${protocol}://${hostname}`
  } else {
    return `${protocol}://${hostname}:${port}`
  }
}

export const getEndpointData = (devMode = false) => {
  const { development, production } = config
  const envConfig                   = devMode ? development : production

  return envConfig.endpoint
}

export default getEndpoint
