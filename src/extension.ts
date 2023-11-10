import * as vscode from 'vscode'
import ConfigService from './services/config'
import OverwriteStrategyService from './services/overwrite-strategy'
import NotifyService from './services/notify'
import FilesGenerationService from './services/files-generation'
import {isNull} from './type-guards'


export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('filesgen.generateFiles', async (resource: vscode.Uri) => {
    const notifyService = new NotifyService()
    const configService = new ConfigService()
    const overwriteService = new OverwriteStrategyService(configService.getOverwriteStrategy())
    const generator = new FilesGenerationService(notifyService, overwriteService)

    if (configService.isConfigEmpty()) {
      notifyService.showEmptyConfigMessage()
      return
    }

    const destination = await notifyService.getDestination(resource)

    if (isNull(destination)) return

    const presets = configService.getPresetsNames()
    const selectedPreset = await notifyService.selectPreset(presets)
    const isNoExistedPresetsSelected = presets?.length && isNull(selectedPreset)

    if (isNoExistedPresetsSelected) return

    try {
      const config = await configService.getPresetConfig(selectedPreset)
      const isSuccess = await generator.generate(destination, config)

      isSuccess //
        ? notifyService.showSuccessMessage(selectedPreset)
        : notifyService.showCancelMessage()
    } catch (error) {
      notifyService.showError(error as string)
    }
  })

  context.subscriptions.push(disposable)
  vscode.commands.executeCommand('setContext', 'filesgen.contextMenuIsVisible', true)
}
