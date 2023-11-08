export type TFile = string;
export type TFolder =
  | TFile
  | { [folderName: string]: TFile | TFolder }
  | (TFile | { [folderName: string]: TFile | TFolder })[]
  | [];

export type Config = {
  [key: string]: TFile | TFolder;
};
