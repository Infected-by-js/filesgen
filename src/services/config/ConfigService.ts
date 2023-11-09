import {WorkspaceConfiguration, workspace, ConfigurationTarget} from 'vscode'
import {EXTENSTION_NAME, CONFIG_KEY_PRESETS, CONFIG_KEY_OVERWRITE} from '../../constants'
import {isEmpty} from '../../helpers'
import {isString, isObject} from '../../type-guards'
import {IConfigService, TConfig, TOverwriteStrategy, TFile, TFolder} from '../../types'

export class ConfigService implements IConfigService {
  private extName = EXTENSTION_NAME
  private presets = CONFIG_KEY_PRESETS
  private overwrite = CONFIG_KEY_OVERWRITE

  private getExtensionConfig(): WorkspaceConfiguration {
    return workspace.getConfiguration(this.extName)
  }

  getPresets(): TConfig | undefined {
    const config = this.getExtensionConfig()
    return config.get(this.presets)
  }

  getOverwriteStrategy(): TOverwriteStrategy | undefined {
    const config = this.getExtensionConfig()
    return config.get(this.overwrite)
  }

  isConfigEmpty(): boolean {
    return isEmpty(this.getPresets())
  }

  async getPresetConfig(presetName: string | null): Promise<TConfig | TFile | TFolder | never> {
    if (this.isConfigEmpty()) {
      try {
        await this.createDefaultPreset()
      } catch (error) {
        throw Error(`Failed to create the configuration file: ${error}`)
      }
    }

    const userConfig = this.getPresets() as TConfig

    return isString(presetName) && isObject(userConfig) ? userConfig[presetName] : userConfig
  }

  getPresetsNames(): string[] {
    const presets = this.getPresets()

    return presets && isObject(presets) ? Object.keys(presets) : []
  }

  private async createDefaultPreset(): Promise<void> {
    const configPath = `${this.extName}.${this.presets}`

    await this.getExtensionConfig().update(configPath, [], ConfigurationTarget.Global)
  }
}
