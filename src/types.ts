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
  showSuccessMessage(presetName?: string): void
  showEmptyConfigMessage(): void
  selectPreset(keys: string[]): Promise<string | undefined>
  getDestination(): Promise<Uri | undefined>
  confirmAction(message: string): Promise<boolean>
}

export interface IOverwriteStrategyService {
  createFile(fileName: string, currentDir: Uri, notifier: INotifyService): Promise<void>
  createFolder(folderName: string, currentDir: Uri, notifier: INotifyService): Promise<void>
}
export interface IConfigService {
  getPresets(): TConfig | undefined
  getPresetConfig(presetName: string | null): Promise<TConfig | TFile | TFolder | never>
  getOverwriteStrategy(): TOverwriteStrategy | undefined
  isConfigEmpty(): boolean
}
