import { Wallet } from 'ethers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { getVaults, Vault } from './vaults'
import { deposit } from './helpers/deposit'

type Constructor = {
  mnemonic:  string,
  apiKey:    string,
  apiSecret: string,
  endpoint?: string
}

type Deposit = {
  amount: string
  poolId: 'mumbai-dai' | undefined
  unit:   'native' | 'wei' | undefined
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

  async deposit({ amount, poolId, unit }: Deposit): Promise<Array<TransactionReceipt>> {
    return await deposit(this, {
      amount,
      poolId: poolId || 'mumbai-dai',
      unit:   unit   || 'wei'
    })
  }
}
