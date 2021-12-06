import config from '../config.json'

const getEndpoint = () => {
  const { protocol, hostname, port } = config.endpoint
  const hasDefaultPort               =
    (protocol === 'https' && port === 443) ||
    (protocol === 'http' && port === 80)

  if (hasDefaultPort) {
    return `${protocol}://${hostname}`
  } else {
    return `${protocol}://${hostname}:${port}`
  }
}

export default getEndpoint
