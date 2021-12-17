import { Wallet } from 'ethers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { getVaults, Vault } from './vaults'
import { deposit } from './helpers/deposit'
import { TransactionsResponse } from './helpers/transaction'
import { withdraw } from './helpers/withdraw'

type Constructor = {
  mnemonic:  string,
  apiKey:    string,
  apiSecret: string,
  endpoint?: string
}

type Deposit = {
  amount:          string
  vaultIdentifier: 'mumbai_dai'
  unit:            'native' | 'wei' | undefined
}

type Withdraw = {
  amount:          string
  vaultIdentifier: 'mumbai_dai'
  unit:            'native' | 'wei' | undefined
}

export default class TwoPi {
  readonly mnemonic:  string
  readonly address:   string
  readonly apiKey:    string
  readonly apiSecret: string
  readonly endpoint:  string
  readonly wallet:    Wallet

  constructor({ mnemonic, apiKey, apiSecret, endpoint }: Constructor) {
    this.mnemonic  = mnemonic
    this.wallet    = Wallet.fromMnemonic(mnemonic)
    this.address   = this.wallet.address
    this.apiKey    = apiKey
    this.apiSecret = apiSecret
    this.endpoint  = endpoint || 'https://api.2pi.network'
  }

  async getVaults(): Promise<Array<Vault>> {
    return await getVaults(this)
  }

  async deposit({ amount, vaultIdentifier, unit }: Deposit): TransactionsResponse {
    return await deposit(this, {
      amount,
      vaultIdentifier,
      unit: unit || 'wei'
    })
  }

  async withdraw({ amount, vaultIdentifier, unit }: Withdraw): TransactionsResponse {
    return await withdraw(this, {
      amount,
      vaultIdentifier,
      unit: unit || 'wei'
    })
  }
}
