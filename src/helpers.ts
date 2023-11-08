import {window, workspace, Uri} from 'vscode'
import {Config} from './types'
export function showError(message: string) {
  window.showErrorMessage(message)
}

export function showSuccessMessage(configName: string): void {
  window.showInformationMessage(`Successfully generated files from ${configName}`)
}

export async function selectConfigKey(config: Config): Promise<string | null> {
  if (Array.isArray(config) || typeof config !== 'object') {
    return null
  }

  const selectedKey = await window.showQuickPick(Object.keys(config), {
    placeHolder: 'Select a key from the config file',
  })

  return selectedKey ?? null
}

export async function getDestination(): Promise<Uri> {
  const destinationDir = await getDestinationDirectory()
  return getDestinationUri(destinationDir)
}

async function getDestinationDirectory(defaultValue = 'src'): Promise<string | undefined> {
  return window.showInputBox({
    placeHolder: 'Enter the destination directory (src by default)',
    prompt: 'Specify the directory where you want to generate the file',
    value: defaultValue,
  })
}

function getDestinationUri(destinationDir = '.'): Uri {
  return Uri.joinPath(workspace.workspaceFolders?.[0]?.uri ?? Uri.file('.'), destinationDir)
}
