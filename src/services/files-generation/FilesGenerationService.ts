import {workspace, Uri} from 'vscode'
import {isString, isArray} from '../../type-guards'
import {IConfigService, INotifyService, IOverwriteStrategyService, TConfig, TFile, TFolder} from '../../types'
import {isEmpty} from '../../helpers'

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
      this.showError(`The root path does not exist`)
      return
    }

    try {
      const config = await this.getConfig(presetName)
      const isSuccess = await this.generateFiles(config, rootPath)

      isSuccess ? this.showSuccess(presetName) : this.showCancel()
    } catch (error) {
      this.showError(error as string)
    }
  }

  private getConfig(presetName: string | null) {
    return this.configService.getPresetConfig(presetName)
  }

  private showError(message: string) {
    this.notifyService.showError(message)
  }

  private showSuccess(message: string | null) {
    this.notifyService.showSuccessMessage(message)
  }

  private showCancel() {
    this.notifyService.showCancelMessage()
  }

  private async generateFiles(config: TConfig | TFile | TFolder, currentDir: Uri): Promise<boolean> {
    if (isString(config)) {
      return this.createFile(config, currentDir)
    }

    if (isArray(config)) {
      return this.generateFilesFromArray(config, currentDir)
    }

    return this.generateFilesFromObject(config, currentDir)
  }

  private async createFile(fileName: string, currentDir: Uri): Promise<boolean> {
    return this.overwriteStrategyService.createFile(fileName, currentDir, this.notifyService)
  }

  private async createFolder(folderName: string, currentDir: Uri): Promise<boolean> {
    return this.overwriteStrategyService.createFolder(folderName, currentDir, this.notifyService)
  }

  private async generateFilesFromArray(config: (TFile | TFolder)[], currentDir: Uri): Promise<boolean> {
    let isCreated = false

    for await (const item of config) {
      isCreated = isString(item) //
        ? await this.createFile(item, currentDir)
        : await this.generateFiles(item, currentDir)

      if (!isCreated) return false
    }

    return isEmpty(config) || isCreated
  }

  private async generateFilesFromObject(config: Record<string, TFolder>, currentDir: Uri): Promise<boolean> {
    let isCreated = false

    for await (const [key, value] of Object.entries(config)) {
      isCreated = await this.createFolder(key, currentDir)

      if (isCreated) {
        const folderPath = Uri.joinPath(currentDir, key)

        isCreated = await this.generateFiles(value, folderPath)
      }

      if (!isCreated) return false
    }

    return isEmpty(config) || isCreated
  }
}
