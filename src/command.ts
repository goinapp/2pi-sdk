import { Command, Option } from 'commander'
import packageConfig from '../package.json'

const command = (): { program: Command, projectPath: string } => {
  let projectPath = null
  const program   = new Command(packageConfig.name)
  const help      = {
    version:     'output the current version',
    development: 'create the project with development endpoint (if in doubt, do not use)',
    mnemonic:    'provide your own mnemonic',
    key:         'provide your API key',
    secret:      'provide your API secret (be carefull, can be seen using shell history)',
    project:     'project name (it will also become the project directory)'
  }

  program
    .version(packageConfig.version, '-v, --version', help.version)
    .option('-d, --development', help.development)
    .addOption(new Option('-m, --mnemonic <words...>', help.mnemonic).env('MNEMONIC'))
    .addOption(new Option('-k, --key <key>', help.key).env('API_KEY'))
    .addOption(new Option('-s, --secret <secret>', help.secret).env('API_SECRET'))
    .argument('<project-name>', help.project)
    .action(projectName => projectPath = projectName)
    .parse()

  return { program, projectPath: String(projectPath) }
}

export default command
