import routes from './routes.json'
import { post } from './request'
import { TransactionsResponse } from './transaction'
import TwoPi from '../twoPi'

type Faucet = {
  network: 'polygon',
  address: string
}

export const faucet = async (
  twoPi:                TwoPi,
  { network, address }: Faucet
): TransactionsResponse => {
  const data     = { network, address }
  const response = await post(twoPi, routes.faucetPath, data, 422)

  if (response.status === 200) {
    return { status: 'success' }
  } else {
    return {
      status:  'error',
      message: `Faucet response status was ${response.status} (and 200 was expected)`
    }
  }
}
