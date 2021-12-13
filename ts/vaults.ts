import routes from './helpers/routes.json'
import { get } from './helpers/request'
import TwoPi from './twoPi'

type Constructor = {
  pid:          number
  token:        string
  address:      string
  tokenAddress: string
  apy:          number
}

export class Vault {
  readonly pid:          number
  readonly token:        string
  readonly address:      string
  readonly tokenAddress: string
  readonly apy:          number

  constructor({pid, token, address, tokenAddress, apy}: Constructor) {
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
      pid,
      token,
      token_address: tokenAddress
    } = vault

    return new Vault({ address, apy, pid, token, tokenAddress })
  })
}
