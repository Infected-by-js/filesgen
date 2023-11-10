import {Uri, workspace} from 'vscode'
import {IOverwriteStrategyService} from '../../types'

export class SkipCreateStrategy implements IOverwriteStrategyService {
  async createFile(fileName: string, currentDir: Uri): Promise<boolean> {
    const fileContent = ''
    const fileUri = Uri.joinPath(currentDir, fileName)
    const isFileExist = await this.isFileExists(fileUri)

    if (isFileExist) return false

    await workspace.fs.writeFile(fileUri, Buffer.from(fileContent))
    return true
  }

  async createFolder(folderName: string, currentDir: Uri): Promise<boolean> {
    const folderUri = Uri.joinPath(currentDir, folderName)
    const isFolderExist = await this.isFolderExists(folderUri)

    if (isFolderExist) return false

    await workspace.fs.createDirectory(folderUri)
    return true
  }

  private async isFileExists(fileUri: Uri): Promise<boolean> {
    try {
      await workspace.fs.stat(fileUri)
      return true
    } catch {
      return false
    }
  }

  private async isFolderExists(folderUri: Uri): Promise<boolean> {
    try {
      await workspace.fs.readDirectory(folderUri)
      return true
    } catch {
      return false
    }
  }
}
