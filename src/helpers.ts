import {isNull, isObject, isArray, isString, isNumber} from './type-guards'

export function isEmpty(value: unknown): boolean {
  if (isNull(value)) return true
  if (isObject(value) && !Object.keys(value).length) return true
  if (isArray(value) && !value.length) return true
  if (isString(value) && !value.trim().length) return true
  if (isNumber(value)) return true

  return false
}

export const debugLog = (...msg: any) => console.log('\n[DEBUG_LOG]: ' + JSON.stringify(msg, null, 2))
