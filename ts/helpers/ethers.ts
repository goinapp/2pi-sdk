import { Wallet } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import TwoPi from '../twoPi'

type Provider = {
  rpcUrl:  string,
  chainId: number
}

export const getSigner = (twoPi: TwoPi, { rpcUrl, chainId }: Provider): Wallet => {
  const provider = new JsonRpcProvider(rpcUrl, chainId)

  return twoPi.wallet.connect(provider)
}
