import {Uri, workspace} from 'vscode'
import {IOverwriteStrategyService, INotifyService} from '../../types'

export class AskForConfirmationStrategy implements IOverwriteStrategyService {
  async createFile(fileName: string, currentDir: Uri, notifier: INotifyService): Promise<void> {
    const fileContent = ''
    const fileUri = Uri.joinPath(currentDir, fileName)
    const isFileExist = await this.isFileExists(fileUri)

    if (!isFileExist) {
      await workspace.fs.writeFile(fileUri, Buffer.from(fileContent))
      return
    }
    const relativePath = currentDir.path + '/' + fileName
    const confirm = await notifier.confirmAction(`File ${relativePath} already exists.\nDo you want to overwrite?`)

    if (confirm) {
      await workspace.fs.writeFile(fileUri, Buffer.from(fileContent))
    }
  }

  async createFolder(folderName: string, currentDir: Uri, notifier: INotifyService): Promise<void> {
    const folderUri = Uri.joinPath(currentDir, folderName)
    const isFolderExist = await this.isFolderExists(folderUri)

    if (!isFolderExist) {
      await workspace.fs.createDirectory(folderUri)
      return
    }

    const relativePath = currentDir.path + '/' + folderName
    const confirm = await notifier.confirmAction(`Folder ${relativePath} already exists.\nDo you want to overwrite it?`)

    if (confirm) {
      await workspace.fs.createDirectory(folderUri)
    }
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
