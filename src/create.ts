import fs from 'fs'
import os from 'os'
import path from 'path'
import { Buffer } from 'buffer'
import { spawnSync } from 'child_process'

type Options = {
  address:   string,
  mnemonic:  string,
  apiKey:    string,
  apiSecret: string
}

const copyFiles = (source: string, destination: string) => {
  const stats = fs.statSync(source)

  if (stats.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true })

    fs.readdirSync(source).forEach(child => {
      copyFiles(path.join(source, child), path.join(destination, child))
    })
  } else {
    fs.copyFileSync(source, destination)
  }
}

const createEnv = (appPath: string, options: Options) => {
  const filePath = path.join(appPath, '.env')
  let buffer     = Buffer.from('')

  Object.entries(options).forEach(([name, value]) => {
    const constantName = name.replace(/([A-Z])/g, '_$1').toUpperCase()
    const line         = Buffer.from(`${constantName}="${value}"${os.EOL}`)

    buffer = Buffer.concat([buffer, line])
  })

  fs.writeFileSync(filePath, buffer)
}

const packageJsonData = (appName: string) => ({
  name:    appName,
  private: true,
  scripts: {
    test: 'echo "Error: no test specified" && exit 1'
  }
})

const createPackageJson = (appPath: string, appName: string) => {
  const filePath   = path.join(appPath, 'package.json')
  const jsonString = JSON.stringify(packageJsonData(appName), null, 2)

  fs.writeFileSync(filePath, `${jsonString}${os.EOL}`)
}

const installDependencies = (appPath: string) => {
  const deps = ['dotenv', 'ethers']

  const { status, stdout, stderr } = spawnSync(
    'npm',
    ['install', ...deps],
    { cwd: appPath }
  )

  if (status === 0) {
    console.log(stdout.toString())
  } else {
    console.error(stderr.toString())

    process.exit(status || 1)
  }
}

const createApp = (appPath: string, options: Options) => {
  const appName = path.basename(appPath)

  if (fs.existsSync(appPath)) {
    console.log(`The supplied path (${appPath}) exists, please provide a brand new one`)

    process.exit(1)
  }

  console.log('Copying template files...')
  copyFiles(path.join(__dirname, 'templates', 'javascript'), appPath)

  console.log('Saving credentials...')
  createEnv(appPath, options)

  console.log('Creating initial package.json...')
  createPackageJson(appPath, appName)

  console.log('Installing dependencies...')
  installDependencies(appPath)
}

export default createApp
