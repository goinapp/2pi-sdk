import { AxiosResponse } from 'axios'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { getSigner } from './ethers'
import TwoPi from '../twoPi'

export type TransactionsResponse = Promise<{
  status:    string,
  message?:  string,
  cursor?:   number,
  receipts?: Array<TransactionReceipt>
}>

export const processTransactionResponse = async (
  twoPi: TwoPi,
  response: AxiosResponse
): TransactionsResponse => {
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
          return {
            status:  'error',
            cursor:  receipts.length,
            message: `${description} transaction failed (${transactionReceipt.transactionHash})`,
            receipts
          }
        }
      }
    }

    return { status: 'success', receipts }
  } else {
    return {
      status:  'error',
      message: `Withdraw response status was ${response.status} (and 200 was expected)`
    }
  }
}
