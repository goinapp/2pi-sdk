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
  tokenDecimals: number
  vaultDecimals: number
  apy:           number
  tvl:           number
  balances:      Array<Balance>
  deposits:      Array<Deposit>
}

export class Vault {
  readonly identifier:    string
  readonly pid:           number
  readonly token:         string
  readonly address:       string
  readonly tokenAddress:  string
  readonly tokenDecimals: number
  readonly vaultDecimals: number
  readonly apy:           number
  readonly tvl:           number
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
    this.tokenDecimals = tokenDecimals
    this.vaultDecimals = vaultDecimals
    this.apy           = apy
    this.tvl           = tvl
    this.balances      = balances
    this.deposits      = deposits
  }
}

type VaultData = {
  apy:              number
  tvl:              number
  contract_address: string
  identifier:       string
  pid:              number
  token:            string
  token_address:    string
  token_decimals:   number
  vault_decimals:   number
  balances:         Array<Balance>
  deposits:         Array<Deposit>
}

export const getVaults = async (twoPi: TwoPi): Promise<Array<Vault>> => {
  const params   = twoPi.networks ? { only: twoPi.networks } : undefined
  const response = await get(twoPi, routes.vaultsPath, params)

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
