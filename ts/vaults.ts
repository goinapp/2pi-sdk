import routes from './helpers/routes.json'
import { get } from './helpers/request'
import TwoPi from './twoPi'

type Balance = {
  wallet: string
  amount: string
}

type Deposit = {
  wallet: string
  amount: string
}

type Constructor = {
  identifier:    string
  pid:           number
  token:         string
  address:       string
  tokenAddress:  string
  tokenDecimals: string
  vaultDecimals: string
  apy:           number
  tvl:           string
  balances:      Array<Balance>
  deposits:      Array<Deposit>
}

export type Filter = {
  partner:  string | undefined
  networks: Array<string> | undefined
} | undefined

export class Vault {
  readonly identifier:    string
  readonly pid:           number
  readonly token:         string
  readonly address:       string
  readonly tokenAddress:  string
  readonly tokenDecimals: number
  readonly vaultDecimals: number
  readonly apy:           number
  readonly tvl:           string
  readonly balances:      Array<Balance>
  readonly deposits:      Array<Deposit>

  constructor({
    identifier,
    pid,
    token,
    address,
    tokenAddress,
    tokenDecimals,
    vaultDecimals,
    apy,
    tvl,
    balances,
    deposits
  }: Constructor) {
    this.identifier    = identifier
    this.pid           = pid
    this.token         = token
    this.address       = address
    this.tokenAddress  = tokenAddress
    this.tokenDecimals = +tokenDecimals
    this.vaultDecimals = +vaultDecimals
    this.apy           = apy
    this.tvl           = tvl
    this.balances      = balances
    this.deposits      = deposits
  }
}

type VaultData = {
  apy:              number
  tvl:              string
  contract_address: string
  identifier:       string
  pid:              number
  token:            string
  token_address:    string
  token_decimals:   string
  vault_decimals:   string
  balances:         Array<Balance>
  deposits:         Array<Deposit>
}

const params = (filter: Filter): Record<string, string | Array<string>> => {
  const params: Record<string, string | Array<string>> = {}

  if (filter?.networks) {
    params.only = filter.networks
  }

  if (filter?.partner) {
    params.partner = filter?.partner
  }

  return params
}

export const getVaults = async (twoPi: TwoPi, filter: Filter): Promise<Array<Vault>> => {
  const response = await get(twoPi, routes.vaultsPath, params(filter))

  return response.data.data.map((vault: VaultData): Vault => {
    const {
      apy,
      tvl,
      contract_address: address,
      identifier,
      pid,
      token,
      token_address: tokenAddress,
      token_decimals: tokenDecimals,
      vault_decimals: vaultDecimals,
      balances,
      deposits
    } = vault

    return new Vault({
      address,
      apy,
      tvl,
      identifier,
      pid,
      token,
      tokenAddress,
      tokenDecimals,
      vaultDecimals,
      balances,
      deposits
    })
  })
}
