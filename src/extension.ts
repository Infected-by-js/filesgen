import * as vscode from 'vscode'
import {FilesGeneratorController} from './controllers'


export function activate(context: vscode.ExtensionContext) {
  // Generate with settings.json
  let disposable = vscode.commands.registerCommand('filesgen.generateFiles', async (resource: vscode.Uri) => {
    const filesGeneratorController = new FilesGeneratorController()
    filesGeneratorController.generateFiles(resource)
  })

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
