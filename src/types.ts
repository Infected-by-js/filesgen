export type TFile = string
export type TFolder =
  | TFile
  | {[folderName: string]: TFile | TFolder}
  | (TFile | {[folderName: string]: TFile | TFolder})[]
  | []

export type TConfig =
  | {
      [key: string]: TFile | TFolder
    }
  | []
  | string

export const isObject = (input: unknown): input is Record<string, unknown> => {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
}

export const isArray = (input: unknown): input is unknown[] | [] => {
  return Array.isArray(input)
}
export const isString = (input: unknown): input is string => {
  return typeof input === 'string'
}

export const isNumber = (input: unknown): input is number => {
  return typeof input === 'number' && !isNaN(input)
}
export const isNull = (input: unknown): input is null => {
  return input === null
}

export const isUndefined = (input: unknown): input is undefined => {
  return input === undefined
}
