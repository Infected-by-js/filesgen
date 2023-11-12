export const EXTENSTION_NAME = 'filesgen'
export const CONFIG_KEY_PRESETS = 'presets'
export const CONFIG_KEY_OVERWRITE = 'overwriteStrategy'
export const TEMP_EDITOR_FILENAME = 'filesgen.temp.json'
export const TEMP_EDITOR_DIRNAME = '.vscode'

export enum OVERWRITE_STRATEGIES {
  force = 'force',
  withConfirm = 'withConfirm',
  none = 'none',
}

export const COMMANDS = {
  generateFromSettingsJson: 'filesgen.generateFilesFromJson',
  generateFromEditor: 'filesgen.generateFilesFromEditor',
}
