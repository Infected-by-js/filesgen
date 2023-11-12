import * as vscode from 'vscode'
import {COMMANDS} from './constants'
import {FilesGeneratorJsonController} from './controllers'

export function activate(context: vscode.ExtensionContext) {
  let json = vscode.commands.registerCommand(COMMANDS.generateFromSettingsJson, async (resource: vscode.Uri) => {
    const generator = new FilesGeneratorJsonController()
    generator.generateFiles(resource)
  })

  context.subscriptions.push(json)

  vscode.commands.executeCommand('setContext', 'filesgen.contextMenuIsVisible', true)
}
