import routes from './routes.json'
import { post } from './request'
import { processTransactionResponse, TransactionsResponse } from './transaction'
import TwoPi from '../twoPi'

type Deposit = {
  amount:          string,
  vaultIdentifier: 'mumbai_dai',
  unit:            'native' | 'wei'
}

export const deposit = async (
  twoPi: TwoPi,
  { amount, vaultIdentifier, unit }: Deposit
): TransactionsResponse => {
  const data     = { deposit: { amount, unit, vault_identifier: vaultIdentifier } }
  const response = await post(twoPi, routes.depositsPath, data)

  return await processTransactionResponse(twoPi, vaultIdentifier, response)
}
