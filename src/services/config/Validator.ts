import {isEmpty} from '../../helpers'
import {isObject, isArray, isString} from '../../type-guards'
import {IValidator, TConfig} from '../../types'

export class Validator implements IValidator {
  configFromString(config: string): TConfig | null {
    try {
      const parsedConfig = JSON.parse(config)

      return this.isValidConfig(parsedConfig) ? parsedConfig : null
    } catch (error) {
      return null
    }
  }

  private isValidConfig(config: unknown): boolean {
    if (isObject(config)) return this.isValidObject(config)
    if (isArray(config)) return this.isValidArray(config)
    if (isString(config)) return this.isValidString(config)

    return false
  }

  private isValidArray(configArray: unknown[]): boolean {
    return configArray.every((item) => this.isValidConfig(item))
  }

  private isValidObject(configObject: unknown): boolean {
    if (!isObject(configObject)) return false

    const keys = Object.keys(configObject)

    if (!keys.length) return true

    return keys.every((key) => {
      return isString(key) && (this.isValidConfig(configObject[key]) || isEmpty(configObject[key]))
    })
  }

  private isValidString(configString: unknown): boolean {
    return isString(configString)
  }
}
