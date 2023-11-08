import {window, workspace, Uri} from 'vscode'
import {isArray, isNull, isNumber, isObject, isString, isUndefined} from './types'
import {CONFIG_KEY, EXTENSTION_NAME} from './constants'
export function showError(message: string) {
  window.showErrorMessage(message)
}

export function showSuccessMessage(presetName: string | null): void {
  window.showInformationMessage(`Successfully generated files from ${presetName ?? CONFIG_KEY}`)
}

export function showEmptyConfigMessage(): void {
  const message = `Nothing to generate. Create a [config](command:workbench.action.openSettings?%22${EXTENSTION_NAME}.${CONFIG_KEY}%22) first.`
  window.showInformationMessage(message)
}

export async function selectConfigKey(keys: string[]): Promise<string | null> {
  if (!keys.length) return null

  const selectedKey = await window.showQuickPick(keys, {
    placeHolder: 'Select a key from the config file',
  })

  return selectedKey ?? null
}

export async function getDestination(): Promise<Uri | null> {
  const destinationDir = await getDestinationDirectory()

  if (isUndefined(destinationDir)) return null

  return getDestinationUri(destinationDir)
}

async function getDestinationDirectory(defaultValue = 'src'): Promise<string | undefined> {
  return window.showInputBox({
    placeHolder: 'Enter the destination directory',
    prompt: 'Specify the directory where you want to generate the file',
    value: defaultValue,
  })
}

function getDestinationUri(destinationDir = '.'): Uri {
  return Uri.joinPath(workspace.workspaceFolders?.[0]?.uri ?? Uri.file('.'), destinationDir)
}

export function isEmpty(value: unknown): boolean {
  if (isNull(value)) return true
  if (isObject(value) && !Object.keys(value).length) return true
  if (isArray(value) && !value.length) return true
  if (isString(value) && !value.trim().length) return true
  if (isNumber(value)) return true

  return false
}
