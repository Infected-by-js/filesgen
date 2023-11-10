import {Uri, workspace} from 'vscode'
import {IOverwriteStrategyService, INotifyService} from '../../types'

export class AskForConfirmationStrategy implements IOverwriteStrategyService {
  private parentFolderConfirmed: Set<string> = new Set()
  private existMessage(type: 'File' | 'Folder', path: string) {
    return `${type}: \n${path} already exists.\nDo you want to overwrite?`
  }

  async createFile(fileName: string, currentDir: Uri, notifier: INotifyService): Promise<boolean> {
    const fileContent = ''
    const fileUri = Uri.joinPath(currentDir, fileName)
    const isFileExist = await this.isFileExists(fileUri)

    if (!isFileExist) {
      await workspace.fs.writeFile(fileUri, Buffer.from(fileContent))
      return true
    }

    const filePath = currentDir.path + '/' + fileName
    const isForceRewrite = this.parentFolderConfirmed.has(currentDir.path)

    const confirm = isForceRewrite || (await notifier.confirmAction(this.existMessage('File', filePath)))

    if (confirm) {
      await workspace.fs.writeFile(fileUri, Buffer.from(fileContent))
      return true
    }

    return false
  }

  async createFolder(folderName: string, currentDir: Uri, notifier: INotifyService): Promise<boolean> {
    const folderUri = Uri.joinPath(currentDir, folderName)
    const isFolderExist = await this.isFolderExists(folderUri)

    if (!isFolderExist) {
      await workspace.fs.createDirectory(folderUri)
      return true
    }

    const folderPath = currentDir.path + '/' + folderName

    const confirm = await notifier.confirmAction(this.existMessage('Folder', folderPath))

    if (confirm) {
      this.parentFolderConfirmed.add(folderPath)
      await workspace.fs.createDirectory(folderUri)
      return true
    }

    return false
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
