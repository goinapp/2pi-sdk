import https from 'https'
import http, { IncomingMessage, RequestOptions } from 'http'
import readline from 'readline'
import { stdin as input, stdout as output } from 'process'
import util from 'util'
import config from '../config.json'

type HttpClient = typeof http | typeof https
type ApiKey     = { key: string, secret: string }

export const getApiKey = async (
  { key, secret }: { key: string | undefined, secret: string | undefined }
): Promise<ApiKey> => {
  if (key && secret) {
    return { key, secret }
  } else {
    const read      = readline.createInterface({ input, output })
    const question  = util.promisify(read.question).bind(read)
    const result    = { key: '', secret: '' }
    const questions = {
      key:    'Please provide your API key: ',
      secret: 'Please provide your API secret: '
    }

    try {
      result.key    = key    || String(await question(questions.key))
      result.secret = secret || String(await question(questions.secret))
    } catch (error) {
      console.error(error)
    } finally {
      read.close()
    }

    return result
  }
}

const request = (
  client:  HttpClient,
  options: RequestOptions,
  data:    Uint8Array
): Promise<IncomingMessage> => {
  return new Promise ((resolve, reject) => {
    const request = client.request(options)

    request.on('response', response => resolve(response))
    request.on('error', error => reject(error))

    request.write(data)
    request.end()
  })
}

export const checkApiKey = async (apiKey: ApiKey): Promise<boolean> => {
  const data    = new TextEncoder().encode(JSON.stringify(apiKey))
  const client  = config.endpoint.https ? https : http
  const options = {
    hostname: config.endpoint.hostname,
    port:     config.endpoint.port,
    path:     config.sessionsPath,
    method:   'POST',
    headers:  {
      'Content-Type':   'application/json',
      'Content-Length': data.length
    }
  }

  try {
    const response = await request(client, options, data)

    return response.statusCode === 200
  } catch (error) {
    console.error(error)

    return false
  }
}
