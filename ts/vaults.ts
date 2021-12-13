import routes from './helpers/routes.json'
import { get } from './helpers/request'
import TwoPi from './twoPi'

type Constructor = {
  identifier:   string
  pid:          number
  token:        string
  address:      string
  tokenAddress: string
  apy:          number
}

export class Vault {
  readonly identifier:   string
  readonly pid:          number
  readonly token:        string
  readonly address:      string
  readonly tokenAddress: string
  readonly apy:          number

  constructor({identifier, pid, token, address, tokenAddress, apy}: Constructor) {
    this.identifier   = identifier
    this.pid          = pid
    this.token        = token
    this.address      = address
    this.tokenAddress = tokenAddress
    this.apy          = apy
  }
}

type VaultData = {
  apy:              number,
  contract_address: string,
  identifier:       string,
  pid:              number,
  token:            string,
  token_address:    string
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
      token_address: tokenAddress
    } = vault

    return new Vault({ address, apy, identifier, pid, token, tokenAddress })
  })
}
