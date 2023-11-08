import * as vscode from 'vscode'
import {FilesGenerator} from './FileGenerator'
import {getDestination, selectConfigKey, showError, showSuccessMessage} from './helpers'
import {isNull} from './types'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('filesgen.generateFiles', async (resource: vscode.Uri) => {
    const generator = new FilesGenerator()

    await generator.loadConfig()

    if (!generator.config) {
      showError(`The config file "${generator.configName}" does not exist`)
      return
    }

    const destination = resource && resource.fsPath ? resource : await getDestination()

    if (isNull(destination)) return

    const selectedConfigKey = await selectConfigKey(generator.config)

    generator.generate(destination, selectedConfigKey)
    showSuccessMessage(generator.configName)
  })

  context.subscriptions.push(disposable)
  vscode.commands.executeCommand('setContext', 'filesgen.contextMenuIsVisible', true)
}
