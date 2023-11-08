import * as vscode from 'vscode'
import {FilesGenerator} from './FileGenerator'
import {getDestination, selectConfigKey, showEmptyConfigMessage, showError, showSuccessMessage} from './helpers'
import {isNull, isObject, isUndefined} from './types'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('filesgen.generateFiles', async (resource: vscode.Uri) => {
    const generator = new FilesGenerator()

    if (generator.isConfigEmpty()) {
      showEmptyConfigMessage()
      return
    }
    const destination = resource && resource.fsPath ? resource : await getDestination()

    if (isNull(destination)) return

    const selectedConfigKey = await selectConfigKey(generator.getConfigKeys())

    generator.generate(destination, selectedConfigKey)
    showSuccessMessage(selectedConfigKey)
  })

  context.subscriptions.push(disposable)
  vscode.commands.executeCommand('setContext', 'filesgen.contextMenuIsVisible', true)
}
