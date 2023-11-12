import {IFilesGenerationController, INotifyService, TProcessConfigResult} from '../types'
import {
  ConfigService,
  FilesGenerationService,
  NotifyService,
  OverwriteStrategyService,
  TempEditorService,
} from '../services'
import {isNull} from '../type-guards'
import {Uri} from 'vscode'

export class FilesGenerationEditorController implements IFilesGenerationController {
  private editorService: TempEditorService
  private configService: ConfigService
  private notifyService: INotifyService
  private overwriteService: OverwriteStrategyService
  private generator: FilesGenerationService

  constructor(projectRoot: Uri) {
    this.editorService = new TempEditorService(projectRoot)
    this.configService = new ConfigService()
    this.notifyService = new NotifyService()
    this.overwriteService = new OverwriteStrategyService()
    this.generator = new FilesGenerationService(this.notifyService, this.overwriteService)
  }

  async generateFiles(resource: Uri) {
    const destination = await this.notifyService.getDestination(resource)

    if (isNull(destination)) return

    const savedConfig = await this.editorService.openTempEditor()
    const {isSuccess, config} = await this.processConfig(savedConfig)

    await this.editorService.closeTempEditor()

    if (!isSuccess || isNull(config)) return

    try {
      const isGenerated = await this.generator.generate(destination, config)

      isGenerated //
        ? this.notifyService.showSuccessMessage()
        : this.notifyService.showCancelMessage()
    } catch (error) {
      this.notifyService.showError(error as string)
    }
  }

  private async processConfig(savedConfig: string | null): Promise<TProcessConfigResult> {
    if (isNull(savedConfig)) {
      this.notifyService.showEmptyConfigMessage()

      return {isSuccess: false, config: null}
    }

    const config = this.configService.configFromString(savedConfig)

    if (isNull(config)) {
      this.notifyService.showError('Invalid configuration')

      return {isSuccess: false, config: null}
    }

    return {isSuccess: true, config}
  }
}
