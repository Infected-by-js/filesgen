import * as vscode from 'vscode'
import {FilesGenerator} from './FileGenerator'
import {getDestination, selectConfigKey, showError, showSuccessMessage} from './helpers'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('filesgen.generateFiles', async () => {
    const generator = new FilesGenerator()

    await generator.loadConfig()

    if (!generator.config) {
      showError(`The config file "${generator.configName}" does not exist`)
      return
    }

    const destination = await getDestination()
    const selectedConfigKey = await selectConfigKey(generator.config)

    generator.generate(destination, selectedConfigKey)
    showSuccessMessage(generator.configName)
  })

  context.subscriptions.push(disposable)
}
