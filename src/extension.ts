import * as vscode from 'vscode'
import {COMMANDS} from './constants'
import {FilesGeneratorJsonController, FilesGenerationEditorController} from './controllers'

export function activate(context: vscode.ExtensionContext) {
  let json = vscode.commands.registerCommand(COMMANDS.generateFromSettingsJson, async (resource: vscode.Uri) => {
    const generator = new FilesGeneratorJsonController()
    generator.generateFiles(resource)
  })

  let editor = vscode.commands.registerCommand(COMMANDS.generateFromEditor, async (resource: vscode.Uri) => {
    const projectRoot = vscode.workspace.workspaceFolders?.[0].uri

    if (!projectRoot) {
      vscode.window.showErrorMessage('Please open a folder/workspace before using this command.')
      return
    }

    const generator = new FilesGenerationEditorController(projectRoot)

    generator.generateFiles(resource)
  })

  context.subscriptions.push(json, editor)

  vscode.commands.executeCommand('setContext', 'filesgen.contextMenuIsVisible', true)
}
