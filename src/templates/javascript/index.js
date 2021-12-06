const axios   = require('axios')
const dotenv  = require('dotenv')
const session = require('./lib/session')

dotenv.config()

const main = async () => {
  const endpoint = process.env.ENDPOINT
  const token    = await session.getValidToken()
  const response = await axios.get(`${endpoint}/v1/wallets`, {
    headers: session.getAuthHeader(token)
  })

  if (response.status === 200) {
    const wallets = response.data.data

    console.log('Your wallets')
    console.log(wallets)
  } else {
    console.error(`Response status was ${response.status} (and 200 was expected)`)
  }
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)

  process.exit(1)
})
