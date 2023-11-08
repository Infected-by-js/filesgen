import {workspace, Uri} from 'vscode'
import {TConfig, TFile, TFolder, isArray, isObject, isString} from './types'
import {showError} from './helpers'

export class FilesGenerator {
  config: TConfig | undefined
  configName = 'filesgen.json'

  async loadConfig(configFileName?: string): Promise<void> {
    const rootPath = workspace.workspaceFolders?.[0]?.uri

    if (!rootPath) {
      showError('No workspace folder found.')
      return
    }

    if (configFileName) this.configName = configFileName

    const configUri = Uri.joinPath(rootPath, this.configName)

    try {
      const data = await workspace.fs.readFile(configUri)
      const configString = Buffer.from(data).toString('utf-8')

      this.config = JSON.parse(configString) as TConfig
    } catch (error) {
      showError(`Failed to load the configuration file: ${error}`)
    }
  }

  async generate(rootPath = workspace.workspaceFolders?.[0].uri, configKey: string | null = null): Promise<void> {
    if (!rootPath) {
      showError(`The root path does not exist`)
      return
    }

    if (!this.config) {
      showError(`The config file "${this.configName}" does not exist`)
      return
    }

    const config = isString(configKey) && isObject(this.config) ? this.config[configKey] : this.config
    await this.generateFiles(config, rootPath)
  }

  private async createFile(fileName: string, currentDir: Uri): Promise<void> {
    const fileUri = Uri.joinPath(currentDir, fileName)
    const fileContent = ''

    await workspace.fs.writeFile(fileUri, Buffer.from(fileContent))
  }

  private async createFolder(folderName: string, currentDir: Uri): Promise<void> {
    const folderUri = Uri.joinPath(currentDir, folderName)

    await workspace.fs.createDirectory(folderUri)
  }

  private async generateFiles(config: TFile | TFolder, currentDir: Uri): Promise<void> {
    if (isString(config)) {
      await this.createFile(config, currentDir)
      return
    }

    if (isArray(config)) {
      for (const item of config) {
        if (isString(item)) {
          await this.createFile(item, currentDir)
        } else {
          await this.generateFiles(item, currentDir)
        }
      }
      return
    }

    for (const key in config) {
      const folderPath = Uri.joinPath(currentDir, key)
      const item = config[key]

      await this.createFolder(key, currentDir)
      await this.generateFiles(item, folderPath)
    }
  }
}
