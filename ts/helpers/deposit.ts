import routes from './routes.json'
import { post } from './request'
import { processTransactionResponse, TransactionsResponse } from './transaction'
import TwoPi from '../twoPi'

type Deposit = {
  amount:          string,
  vaultIdentifier: 'mumbai_dai',
  unit:            'native' | 'wei'
  referrer?:       string
}

export const deposit = async (
  twoPi: TwoPi,
  { amount, vaultIdentifier, unit, referrer }: Deposit
): TransactionsResponse => {
  const response = await post(twoPi, routes.depositsPath, {
    deposit: { amount, unit, referrer, vault_identifier: vaultIdentifier }
  })

  return await processTransactionResponse(twoPi, vaultIdentifier, response)
}
