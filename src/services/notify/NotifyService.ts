import {window, Uri, workspace} from 'vscode'
import {EXTENSTION_NAME, CONFIG_KEY_PRESETS} from '../../constants'
import {INotifyService} from '../../types'

export class NotifyService implements INotifyService {
  showError(message: string) {
    window.showErrorMessage(message)
  }

  showSuccessMessage(presetName?: string | undefined | null): void {
    window.showInformationMessage(`Successfully generated files from ${presetName ?? 'config'}`)
  }

  showCancelMessage(): void {
    window.showInformationMessage('Files generation was canceled')
  }

  showEmptyConfigMessage(): void {
    const message = `Nothing to generate. Create a [config](command:workbench.action.openSettings?%22${EXTENSTION_NAME}.${CONFIG_KEY_PRESETS}%22) first.`
    window.showInformationMessage(message)
  }

  async confirmAction(message: string): Promise<boolean> {
    const result = await window.showInformationMessage(message, 'Yes', 'No')

    return result === 'Yes'
  }

  async selectPreset(presetsNames: string[]): Promise<string | null> {
    const preset = await window.showQuickPick(presetsNames, {placeHolder: 'Select a key from the config file'})
    return preset ?? null
  }

  async getDestination(resource?: Uri): Promise<Uri | undefined> {
    if (resource && resource.fsPath) return resource

    const destinationDir = await this.getDestinationDirectory()

    return this.getDestinationUri(destinationDir)
  }

  private async getDestinationDirectory(defaultValue = 'src'): Promise<string | undefined> {
    return window.showInputBox({
      placeHolder: 'Enter the destination directory',
      prompt: 'Specify the directory where you want to generate the file',
      value: defaultValue,
    })
  }

  private getDestinationUri(destinationDir = '.'): Uri {
    return Uri.joinPath(workspace.workspaceFolders?.[0]?.uri ?? Uri.file('.'), destinationDir)
  }
}
