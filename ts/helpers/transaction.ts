import { AxiosResponse } from 'axios'
import { Wallet } from 'ethers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { getSigner } from './ethers'
import { post } from './request'
import routes from './routes.json'
import TwoPi from '../twoPi'

export type TransactionsResponse = Promise<{
  status:    string,
  message?:  string,
  cursor?:   number,
  receipts?: Array<TransactionReceipt>
}>

const registerTransaction = async (
  twoPi:           TwoPi,
  vaultIdentifier: string,
  receipt:         TransactionReceipt
): Promise<TransactionReceipt | undefined> => {
  if (twoPi.address) {
    const path = routes.transactionsPath.replace(/{wallet_id}/g, twoPi.address)
    const data = {
      transaction: {
        id:                  receipt.transactionHash,
        contract_identifier: vaultIdentifier
      }
    }

    try {
      await post(twoPi, path, data)

      return receipt
    } catch (error) {
      console.error(error)
    }
  }
}

const processTransaction = async (
  twoPi:           TwoPi,
  signer:          Wallet | undefined,
  vaultIdentifier: string,
  transaction:     Record<string, unknown>,
  description:     string,
  receipts:        Array<TransactionReceipt>
): Promise<TransactionsResponse | undefined> => {
  if (signer) {
    try {
      const response   = await signer.sendTransaction(transaction)
      const receipt    = await response.wait()
      const registered = await registerTransaction(twoPi, vaultIdentifier, receipt)

      receipts.push(receipt)

      // Status === 1 means success, 0 means it was rejected
      if (! registered?.status) {
        const hash    = receipt.transactionHash
        const message = `${description} transaction failed (${hash})`

        return { status: 'error', cursor: receipts.length, message, receipts }
      }
    } catch (error) {
      const { reason } = Object(error)
      const message    = reason || 'Unknown error'

      return { status: 'failed', cursor: receipts.length, message, receipts }
    }
  }
}

export const processTransactionResponse = async (
  twoPi:           TwoPi,
  vaultIdentifier: string,
  response:        AxiosResponse
): TransactionsResponse => {
  const receipts: Array<TransactionReceipt> = []

  if (response.status === 200) {
    for (const data of response.data.data) {
      const signer = getSigner(twoPi, {
        chainId: data.provider.chain_id,
        rpcUrl:  data.provider.rpc_url
      })

      for (const transactionData of data.transactions) {
        const result = await processTransaction(
          twoPi,
          signer,
          vaultIdentifier,
          transactionData.transaction,
          transactionData.description,
          receipts
        )

        if (result) {
          return result
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
