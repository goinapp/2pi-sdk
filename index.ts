#!/usr/bin/env node

import command from './src/command'
import configWallet from './src/wallet'
import createApp from './src/create'

const { program, projectPath } = command()
const options                  = program.opts()
const { address, mnemonic }    = configWallet({ mnemonic: options.mnemonic })

createApp(projectPath, { address, mnemonic })
