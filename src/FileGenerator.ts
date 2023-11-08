import {workspace, Uri, ConfigurationTarget} from 'vscode'
import {TConfig, TFile, TFolder, isArray, isObject, isString} from './types'
import {isEmpty, showError} from './helpers'
import {CONFIG_KEY, EXTENSTION_NAME} from './constants'

export class FilesGenerator {
  private extName = EXTENSTION_NAME
  private configKey = CONFIG_KEY

  getConfig(): TConfig | undefined {
    const configuration = workspace.getConfiguration(this.extName)
    return configuration.get(this.configKey)
  }

  isConfigEmpty(): boolean {
    return isEmpty(this.getConfig())
  }
  getConfigKeys(): string[] {
    const config = this.getConfig()

    return config && isObject(config) ? Object.keys(config) : []
  }

  async createDefaultConfig(): Promise<void> {
    const defaultConfig = {}
    const configPath = `${this.extName}.${this.configKey}`

    try {
      await workspace.getConfiguration().update(configPath, defaultConfig, ConfigurationTarget.Global)
    } catch (error) {
      showError(`Failed to create the configuration file: ${error}`)
    }
  }

  async generate(rootPath = workspace.workspaceFolders?.[0].uri, configKey: string | null = null): Promise<void> {
    if (!rootPath) {
      showError(`The root path does not exist`)
      return
    }

    if (this.isConfigEmpty()) {
      await this.createDefaultConfig()
    }

    const userConfig = this.getConfig() as TConfig
    const config = isString(configKey) && isObject(userConfig) ? userConfig[configKey] : userConfig

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
