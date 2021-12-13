import axios from 'axios'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { getSigner } from './ethers'
import routes from './routes.json'
import { post } from './request'
import TwoPi from '../twoPi'

type Deposit = {
  amount: string,
  poolId: 'mumbai-dai',
  unit:   'native' | 'wei'
}

export const deposit = async (
  twoPi: TwoPi,
  { amount, poolId, unit }: Deposit
): Promise<Array<TransactionReceipt>> => {
  const data     = { deposit: { amount, unit, pool_id: poolId } }
  const response = await post(twoPi, routes.depositPath, data)
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
    throw new Error(`Deposit response status was ${response.status} (and 200 was expected)`)
  }
}
