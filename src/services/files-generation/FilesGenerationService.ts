import {workspace, Uri} from 'vscode'
import {isString, isArray} from '../../type-guards'
import {IConfigService, INotifyService, IOverwriteStrategyService, TConfig, TFile, TFolder} from '../../types'

export class FilesGenerationService {
  private configService: IConfigService
  private notifyService: INotifyService
  private overwriteStrategyService: IOverwriteStrategyService

  constructor(
    notifyService: INotifyService,
    configService: IConfigService,
    overwriteStrategyService: IOverwriteStrategyService
  ) {
    this.notifyService = notifyService
    this.configService = configService
    this.overwriteStrategyService = overwriteStrategyService
  }

  async generate(rootPath = workspace.workspaceFolders?.[0].uri, presetName: string | null = null): Promise<void> {
    if (!rootPath) {
      this.notifyService.showError(`The root path does not exist`)
      return
    }

    try {
      const config = await this.configService.getPresetConfig(presetName)
      await this.generateFiles(config, rootPath)
    } catch (error) {
      this.notifyService.showError(error as string)
    }
  }

  private async createFile(fileName: string, currentDir: Uri): Promise<void> {
    await this.overwriteStrategyService.createFile(fileName, currentDir, this.notifyService)
  }

  private async createFolder(folderName: string, currentDir: Uri): Promise<void> {
    await this.overwriteStrategyService.createFolder(folderName, currentDir, this.notifyService)
  }

  private async generateFiles(config: TConfig | TFile | TFolder, currentDir: Uri): Promise<void> {
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
