import routes from './helpers/routes.json'
import { get } from './helpers/request'
import TwoPi from './twoPi'

type Balance = {
  wallet: string,
  amount: string
}

type Deposit = {
  wallet: string,
  amount: string
}

type Constructor = {
  identifier:   string
  pid:          number
  token:        string
  address:      string
  tokenAddress: string
  apy:          number,
  balances:     Array<Balance>,
  deposits:     Array<Deposit>
}

export class Vault {
  readonly identifier:   string
  readonly pid:          number
  readonly token:        string
  readonly address:      string
  readonly tokenAddress: string
  readonly apy:          number
  readonly balances:     Array<Balance>
  readonly deposits:     Array<Deposit>

  constructor({
    identifier,
    pid,
    token,
    address,
    tokenAddress,
    apy,
    balances,
    deposits
  }: Constructor) {
    this.identifier   = identifier
    this.pid          = pid
    this.token        = token
    this.address      = address
    this.tokenAddress = tokenAddress
    this.apy          = apy
    this.balances     = balances
    this.deposits     = deposits
  }
}

type VaultData = {
  apy:              number,
  contract_address: string,
  identifier:       string,
  pid:              number,
  token:            string,
  token_address:    string,
  balances:         Array<Balance>,
  deposits:         Array<Deposit>
}

export const getVaults = async (twoPi: TwoPi): Promise<Array<Vault>> => {
  const response = await get(twoPi, routes.vaultsPath)

  return response.data.data.map((vault: VaultData): Vault => {
    const {
      apy,
      contract_address: address,
      identifier,
      pid,
      token,
      token_address: tokenAddress,
      balances,
      deposits
    } = vault

    return new Vault({
      address,
      apy,
      identifier,
      pid,
      token,
      tokenAddress,
      balances,
      deposits
    })
  })
}
