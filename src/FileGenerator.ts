import * as vscode from 'vscode'
import {Config, TFile, TFolder} from './types'
import {showError} from './helpers'

export class FilesGenerator {
  config: Config | undefined
  configName = 'filesgen.json'

  async loadConfig(configFileName?: string): Promise<void> {
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri

    if (!rootPath) {
      showError('No workspace folder found.')
      return
    }

    if (configFileName) this.configName = configFileName

    const configUri = vscode.Uri.joinPath(rootPath, this.configName)

    try {
      const data = await vscode.workspace.fs.readFile(configUri)
      const configString = Buffer.from(data).toString('utf-8')

      this.config = JSON.parse(configString) as Config
    } catch (error) {
      showError(`Failed to load the configuration file: ${error}`)
    }
  }

  async generate(
    rootPath = vscode.workspace.workspaceFolders?.[0].uri,
    configKey: string | null = null
  ): Promise<void> {
    if (!rootPath) {
      showError(`The root path does not exist`)
      return
    }

    if (!this.config) {
      showError(`The config file "${this.configName}" does not exist`)
      return
    }

    const config = typeof configKey === 'string' ? this.config[configKey] : this.config
    await this.generateFiles(config, rootPath)
  }

  private async createFile(fileName: string, currentDir: vscode.Uri): Promise<void> {
    const fileUri = vscode.Uri.joinPath(currentDir, fileName)
    const fileContent = ''

    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(fileContent))
  }

  private async createFolder(folderName: string, currentDir: vscode.Uri): Promise<void> {
    const folderUri = vscode.Uri.joinPath(currentDir, folderName)

    await vscode.workspace.fs.createDirectory(folderUri)
  }

  private async generateFiles(config: TFile | TFolder, currentDir: vscode.Uri): Promise<void> {
    if (typeof config === 'string') {
      await this.createFile(config, currentDir)
      return
    }

    if (Array.isArray(config)) {
      for (const item of config) {
        if (typeof item === 'string') {
          await this.createFile(item, currentDir)
        } else {
          await this.generateFiles(item, currentDir)
        }
      }
      return
    }

    for (const key in config) {
      const folderPath = vscode.Uri.joinPath(currentDir, key)
      const item = config[key]

      await this.createFolder(key, currentDir)
      await this.generateFiles(item, folderPath)
    }
  }
}
