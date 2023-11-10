import * as vscode from 'vscode'
import ConfigService from './services/config'
import OverwriteStrategyService from './services/overwrite-strategy'
import NotifyService from './services/notify'
import FilesGenerationService from './services/files-generation'
import {isNull, isUndefined} from './type-guards'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('filesgen.generateFiles', async (resource: vscode.Uri) => {
    const notifier = new NotifyService()
    const config = new ConfigService()
    const fileCreateStrategy = new OverwriteStrategyService(config.getOverwriteStrategy())
    const generator = new FilesGenerationService(notifier, config, fileCreateStrategy)

    if (config.isConfigEmpty()) {
      notifier.showEmptyConfigMessage()
      return
    }
    const destination = await notifier.getDestination(resource)

    if (isNull(destination)) return

    const selectedConfigKey = await notifier.selectPreset(config.getPresetsNames())

    if (isUndefined(selectedConfigKey)) return

    generator.generate(destination, selectedConfigKey)
  })

  context.subscriptions.push(disposable)
  vscode.commands.executeCommand('setContext', 'filesgen.contextMenuIsVisible', true)
}
