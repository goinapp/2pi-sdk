import { AxiosResponse } from 'axios'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { getSigner } from './ethers'
import TwoPi from '../twoPi'

export const processTransactionResponse = async (
  twoPi: TwoPi,
  response: AxiosResponse
): Promise<Array<TransactionReceipt>> => {
  const receipts = []

  if (response.status === 200) {
    for (const data of response.data.data) {
      const signer = getSigner(twoPi, {
        chainId: data.provider.chain_id,
        rpcUrl:  data.provider.rpc_url
      })

      for (const transactionData of data.transactions) {
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
