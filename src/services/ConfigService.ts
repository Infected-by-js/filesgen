import {workspace, ConfigurationTarget} from 'vscode'
import {EXTENSTION_NAME, CONFIG_KEY_PRESETS} from '../constants'
import {isEmpty} from '../helpers'
import {isString, isObject} from '../type-guards'
import {IConfigService, TConfig, TFile, TFolder} from '../types'

export class ConfigService implements IConfigService {
  private extName = EXTENSTION_NAME
  private presets = CONFIG_KEY_PRESETS
  private initialConfig?: TConfig

  useConfig(initialConfig: TConfig): void {
    this.initialConfig = initialConfig
  }

  getConfig(): TConfig | undefined {
    if (this.initialConfig) return this.initialConfig

    const config = workspace.getConfiguration(this.extName)
    return config.get(this.presets)
  }

  isConfigEmpty(): boolean {
    return isEmpty(this.getConfig())
  }

  async getPreset(presetName: string | null): Promise<TConfig | TFile | TFolder | never> {
    if (this.isConfigEmpty()) {
      try {
        await this.createDefaultPreset()
      } catch (error) {
        throw Error(`Failed to create the configuration file: ${error}`)
      }
    }

    const userConfig = this.getConfig() as TConfig

    return isString(presetName) && isObject(userConfig) ? userConfig[presetName] : userConfig
  }

  getPresetsNames(): string[] {
    const presets = this.getConfig()

    return presets && isObject(presets) ? Object.keys(presets) : []
  }

  private async createDefaultPreset(): Promise<void> {
    const configPath = `${this.extName}.${this.presets}`
    const config = workspace.getConfiguration(this.extName)

    await config.update(configPath, [], ConfigurationTarget.Global)
  }
}
