# Welcome to 2PI SDK

JavaScript SDK for building with 2PI Protocol

* [Homepage](https://2pi.network)
* [Docs](https://docs.2pi.network)

# Installation

## Using yarn

```console
yarn add @2pi-network/sdk
```

## Using npm

```console
npm i @2pi-network/sdk
```

# Usage

Here is a quick look at using the SDK. This assume you have some environment variables:

* MNEMONIC: this should contain a valid [mnemonic](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).
* API_KEY: API key value.
* API_SECRET: API secret value.

```js
const { TwoPi } = require('@2pi-network/sdk')

const main = async () => {
  const mnemonic  = process.env.MNEMONIC
  const apiKey    = process.env.API_KEY
  const apiSecret = process.env.API_SECRET
  const twoPi     = new TwoPi({ mnemonic, apiKey, apiSecret })
  const vaults    = await twoPi.getVaults()

  vaults.forEach(vault => {
    console.log('Identifier',     vault.identifier)
    console.log('PID',            vault.pid)
    console.log('Token',          vault.token)
    console.log('Address',        vault.address)
    console.log('Token address',  vault.tokenAddress)
    console.log('Token decimals', vault.tokenDecimals)
    console.log('Vault decimals', vault.vaultDecimals)
    console.log('APY',            vault.apy)
    console.log('TVL',            vault.tvl)
    console.log('Balances',       vault.balances)
    console.log('Deposits',       vault.deposits)
  })
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(1)
})
```

# Public classes

* [TwoPi](#twopi-instance)
  * [Attributes](#twopi-public-attributes)
  * [Methods](#twopi-public-methods)

# Private classes (may become public on future releases)

* [Vault](#vault-instance)
  * [Attributes](#vault-private-attributes)
  * [Methods](#vault-private-methods)

## TwoPi instance

This is the entry point of almost any interaction. You will be asked to provide at least 3 arguments:

* One mnemonic, this would be used to sign and send the relevant transactions.
* API key, together with API secret will be used to connect with 2PI network API.
* API secret, together with API key will be used to connect with 2PI network API.

### TwoPi public attributes

On every `twoPi` instance you can access the following attributes:

* `mnemonic?`: the provided mnemonic for this instance.
* `path?`: the provided derivation path for this instance (defaults to `m/44'/60'/0'/0/0`).
* `address?`: the public address derived from the provided mnemonic.
* `apiKey?`: the provided API key. [^1]
* `apiSecret?`: the provided API secret. [^1]
* `endpoint`: the API endpoint in use.
* `wallet`: the wallet instance, derived from the provided mnemonic.

[^1]: If not provided, you can still use all the unauthenticated operations (`getVaults()`, `deposit(...)` and `withdraw(...)`).

### TwoPi public methods

* `constructor({mnemonic?, path?, apiKey?, apiSecret?, endpoint?})` returns a new instance. Refer to [TwoPi public attributes](#twopi-public-attributes) to get a description of each argument.
* `async getVaults({networks?, partner?})` it returns an array of available vaults (each of which are Vault instances). You can give an optional filter object like `{networks: ['mumbai']}` to narrow the results to the specified networks. If you are a partner, the filter also support custom vaults by using an object like `{partner: 'company_name'}`.
* `async deposit({amount, vaultIdentifier, unit?, referrer?})` it makes a deposit on the given pool. For `amount` prefer string to keep precision. If `unit` is `'wei'` (default) amount would not be converted. If `unit` is `'native'` the provided amount would be interpreted like fetched directly from some UI (for example 1 for ETH would be converted to `1 * 1e18`). The `vaultIdentifier` argument can be omitted, the only (and default) options for the time being is `mumbai_dai`. The `referrer` argument can be an address to associate who brought the user making the deposit (only assigned on the very first call for any given sender, after that is ignored).
  * `status`: can be 'success' or 'error'
  * `transactions`?: array of executed transactions as [transaction receipts](https://docs.ethers.io/v5/single-page/#/v5/api/providers/types/-%23-providers-TransactionReceipt) (in case of error, the last one should have the required information to trace the reason).
  * `message`?: in case of error, the overall main reason description.
  * `cursor`?: in case of error, the index (zero based) of the failed transaction.
* `async withdraw({amount, vaultIdentifier, unit?})` it makes a withdraw on the given pool. For `amount` prefer string to keep precision. If `unit` is `'wei'` (default) amount would not be converted. If `unit` is `'native'` the provided amount would be interpreted like fetched directly from some UI (for example 1 for ETH would be converted to `1 * 1e18`). The `vaultIdentifier` argument can be omitted, the only (and default) options for the time being is `mumbai_dai`. Returns an object with the following attributes:
  * `status`: can be 'success', 'failed' or 'error'
  * `transactions`?: array of executed transactions as [transaction receipts](https://docs.ethers.io/v5/single-page/#/v5/api/providers/types/-%23-providers-TransactionReceipt) (in case of error, the last one should have the required information to trace the reason).
  * `message`?: in case of failed or error, the overall main reason description.
  * `cursor`?: in case of failed or error, the index (zero based) of the failed transaction.
* `async faucet({network, address})` it transfer some native tokens to the given `address`. You should ask our team to enable this feature (use the Discord channel below). For `network` the only allowed value for the time being is `'polygon'`. If `address` has already the minimum native token balance (0.1 MATIC on Polygon) nothing is done, it gets completed to this value otherwise. Returns an object with the following attributes:
  * `status`: can be 'success', 'error'
  * `message`?: in case of failed or error, the overall main reason description.

### Vault private attributes

On every `vault` instance you can access the following attributes:

* `identifier`: the vault identifier, used as argument on deposit and withdraw operation (referred as `vaultIdentifier`).
* `pid`: the vault _internal_ ID.
* `token`: string identifying the token being maximized.
* `address`: string with the vault main contract address.
* `tokenAddress`: string with the vault token address.
* `tokenDecimals`: how many decimals to consider for the token.
* `vaultDecimals`: how many decimals to consider for the vault.
* `apy`: the current vault [APY](https://en.wikipedia.org/wiki/Annual_percentage_yield).
* `tvl`: the current vault <abbr title="Total Value Locked">TVL</abbr> expressed in wei of the underlying token (as string).
* `balances`: array of the current balances of the registered wallets (represented in objects `{ wallet: string, amount: string }`).
* `deposits`: array of the current deposits of the registered wallets (represented in objects `{ wallet: string, amount: string }`).

### Vault private methods

* `constructor({identifier, pid, token, address, tokenAddress, tokenDecimals, vaultDecimals, apy, tvl, balances, deposits})` refer to [Vault private attributes](#vault-private-attributes) to get a description of each argument and attribute.

## Warning

Always be careful when storing mnemonic and API keys / secret data.

# Let's talk!

* [Join our #devs](https://discord.gg/fyc42N2d) channel on Discord!
