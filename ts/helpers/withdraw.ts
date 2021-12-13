import axios from 'axios'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { getSigner } from './ethers'
import routes from './routes.json'
import { post } from './request'
import TwoPi from '../twoPi'

type Withdraw = {
  amount:          string,
  vaultIdentifier: 'mumbai_dai',
  unit:            'native' | 'wei'
}

export const withdraw = async (
  twoPi: TwoPi,
  { amount, vaultIdentifier, unit }: Withdraw
): Promise<Array<TransactionReceipt>> => {
  const data     = { withdraw: { amount, unit, vault_identifier: vaultIdentifier } }
  const response = await post(twoPi, routes.withdrawsPath, data)
  const receipts = []

  if (response.status === 200) {
    for (let data of response.data.data) {
      const signer = getSigner(twoPi, {
        chainId: data.provider.chain_id,
        rpcUrl:  data.provider.rpc_url
      })

      for (let transactionData of data.transactions) {
        const { description, transaction } = transactionData

        const transactionResponse = await signer.sendTransaction(transaction)
        const transactionReceipt  = await transactionResponse.wait()

        receipts.push(transactionReceipt)

        // Status === 1 means success, 0 means it was rejected
        if (! transactionReceipt.status) {
          throw new Error(`${description} transaction failed (${transactionReceipt.transactionHash})`)
        }
      }
    }

    return receipts
  } else {
    throw new Error(`Withdraw response status was ${response.status} (and 200 was expected)`)
  }
}
