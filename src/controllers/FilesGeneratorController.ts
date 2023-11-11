import {Uri} from 'vscode'
import {isEmpty} from '../helpers'
import {isNull} from '../type-guards'
import {TConfig} from '../types'
import {NotifyService, ConfigService, OverwriteStrategyService, FilesGenerationService} from '../services'

export class FilesGeneratorController {
  private notifyService: NotifyService
  private configService: ConfigService
  private overwriteService: OverwriteStrategyService
  private generator: FilesGenerationService

  constructor() {
    this.notifyService = new NotifyService()
    this.configService = new ConfigService()
    this.overwriteService = new OverwriteStrategyService()
    this.generator = new FilesGenerationService(this.notifyService, this.overwriteService)
  }

  async generateFiles(resource: Uri, config?: TConfig) {
    if (config) this.configService.useConfig(config)

    if (this.configService.isConfigEmpty()) {
      this.notifyService.showEmptyConfigMessage()
      return
    }

    const destination = await this.notifyService.getDestination(resource)

    if (isNull(destination)) return

    const presets = this.configService.getPresetsNames()
    let preset = null

    if (!isEmpty(presets)) {
      preset = await this.notifyService.selectPreset(presets)

      if (isNull(preset)) return
    }

    try {
      const config = await this.configService.getPreset(preset)
      const isSuccess = await this.generator.generate(destination, config)

      isSuccess //
        ? this.notifyService.showSuccessMessage(preset)
        : this.notifyService.showCancelMessage()
    } catch (error) {
      this.notifyService.showError(error as string)
    }
  }
}
