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

  console.log(await twoPi.getVaults())
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

# Private classes (may become public on some future release)

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

* `mnemonic`: the provided mnemonic for this instance.
* `address`: the public address derived from the provided mnemonic.
* `apiKey`: the provided API key.
* `apiSecret`: the provided API secret.
* `endpoint`: the API endpoint in use.
* `wallet`: the wallet instance, derived from the provided mnemonic.

### TwoPi public methods

* `constructor({mnemonic, apiKey, apiSecret, endpoint?})` returns a new instance. Refer to [TwoPi public attributes](#twopi-public-attributes) to get a description of each argument.
* `async getVaults()` it returns an array of available vaults (each of which are Vault instances).
* `async deposit({amount, poolId?, unit?})` it makes a deposit on the given pool and returns an array of [transaction receipts](https://docs.ethers.io/v5/single-page/#/v5/api/providers/types/-%23-providers-TransactionReceipt). For `amount` prefer string to keep precision. If `unit` is `'wei'` (default) amount would not be converted. If `unit` is `'native'` the provided amount would be interpreted like fetched directly from some UI (for example 1 for ETH would be converted to `1 * 1e18`). The `poolId` argument can be omitted, the only (and default) options for the time being is `mumbai-dai`.

### Vault private attributes

On every `vault` instance you can access the following attributes:

* `pid`: the vault _internal_ ID.
* `token`: string identifying the token being maximized.
* `address`: string with the vault main contract address.
* `tokenAddress`: string with the vault token address.
* `apy`: the current vault [APY](https://en.wikipedia.org/wiki/Annual_percentage_yield).

### Vault private methods

* `constructor({pid, token, address, tokenAddress, apy})` refer to [Vault private attributes](#vault-private-attributes) to get a description of each argument and attribute.

## Warning

Always be careful when storing mnemonic and API keys / secret data.

# Let's talk!

* [Join our #devs](https://discord.gg/fyc42N2d) channel on Discord!
