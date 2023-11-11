import {Uri} from 'vscode'
import {OVERWRITE_STRATEGIES} from './constants'

export type TFile = string
export type TFolder =
  | TFile
  | {[folderName: string]: TFile | TFolder}
  | (TFile | {[folderName: string]: TFile | TFolder})[]
  | []

export type TConfig = {[presetName: string]: TFile | TFolder} | (TFile | TFolder)[]

export type TOverwriteStrategy = keyof typeof OVERWRITE_STRATEGIES

export interface INotifyService {
  showError(message: string): void
  showSuccessMessage(presetName: string | null): void
  showCancelMessage(): void
  showEmptyConfigMessage(): void
  selectPreset(keys: string[]): Promise<string | null | undefined>
  getDestination(): Promise<Uri | undefined>
  confirmAction(message: string): Promise<boolean>
}

export interface IOverwriteStrategyService {
  createFile(fileName: string, currentDir: Uri, notifier: INotifyService): Promise<boolean>
  createFolder(folderName: string, currentDir: Uri, notifier: INotifyService): Promise<boolean>
}
export interface OverwriteStrategyMap {
  [OVERWRITE_STRATEGIES.force]: () => IOverwriteStrategyService
  [OVERWRITE_STRATEGIES.withConfirm]: () => IOverwriteStrategyService
  [OVERWRITE_STRATEGIES.none]: () => IOverwriteStrategyService
}

export interface IConfigService {
  getConfig(): TConfig | undefined
  getPreset(presetName: string | null): Promise<TConfig | TFile | TFolder | never>
  useConfig(initialConfig: TConfig): void
  isConfigEmpty(): boolean
}
