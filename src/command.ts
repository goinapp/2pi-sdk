import { Command, Option } from 'commander'
import packageConfig from '../package.json'

const command = (): { program: Command, projectPath: string } => {
  let projectPath = null
  const program   = new Command(packageConfig.name)

  program
    .version(packageConfig.version, '-v, --version', 'output the current version')
    .addOption(new Option('-m, --mnemonic <words...>', 'provide your own mnemonic').env('MNEMONIC'))
    .argument('<project-name>', 'project name (it will also become the project directory)')
    .action(projectName => projectPath = projectName)
    .parse()

  return { program, projectPath: String(projectPath) }
}

export default command
