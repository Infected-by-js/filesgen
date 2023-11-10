import {Uri, workspace} from 'vscode'
import {IOverwriteStrategyService} from '../../types'

export class ForceCreateStrategy implements IOverwriteStrategyService {
  async createFile(fileName: string, currentDir: Uri): Promise<boolean> {
    const fileUri = Uri.joinPath(currentDir, fileName)
    const fileContent = ''

    await workspace.fs.writeFile(fileUri, Buffer.from(fileContent))
    return true
  }

  async createFolder(folderName: string, currentDir: Uri): Promise<boolean> {
    const folderUri = Uri.joinPath(currentDir, folderName)

    await workspace.fs.createDirectory(folderUri)
    return true
  }
}
