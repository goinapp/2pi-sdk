import { ethers } from 'ethers'

const configWallet = ({ mnemonic } : { mnemonic: Array<string> | undefined }) => {
  let wallet

  if (mnemonic) {
    console.log('Using provided mnemonic')

    wallet = ethers.Wallet.fromMnemonic(mnemonic.join(' '))
  } else {
    console.log('Creating a new mnemonic...')

    wallet = ethers.Wallet.createRandom()
  }

  const { address } = wallet
  const { phrase }  = wallet.mnemonic

  return { address, mnemonic: phrase }
}

export default configWallet
