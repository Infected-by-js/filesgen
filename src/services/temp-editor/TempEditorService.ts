import {TextDocument, Uri, workspace, window, ViewColumn, Disposable, commands} from 'vscode'
import {TEMP_EDITOR_FILENAME, TEMP_EDITOR_DIRNAME} from '../../constants'
import {ITempEditorService} from '../../types'

export class TempEditorService implements ITempEditorService {
  private readonly editorName = TEMP_EDITOR_FILENAME
  private readonly editorDirName = TEMP_EDITOR_DIRNAME
  private document: TextDocument | null = null
  private disposables: Disposable[] = []
  private tempFilePath: Uri | null = null

  constructor(projectRoot: Uri) {
    this.tempFilePath = Uri.joinPath(projectRoot, this.editorDirName, this.editorName)
  }

  async openTempEditor(): Promise<string | null> {
    if (!this.tempFilePath) return null

    const editorContent = `[]`

    await workspace.fs.writeFile(this.tempFilePath, Buffer.from(editorContent))

    this.document = await workspace.openTextDocument(this.tempFilePath)

    await window.showTextDocument(this.document, ViewColumn.One)

    return this.getEditorText(this.document)
  }

  async closeTempEditor(): Promise<void> {
    if (!this.document) return

    await workspace.fs.writeFile(this.document.uri, Buffer.from(''))
    await workspace.fs.delete(this.document.uri, {useTrash: true})
    await commands.executeCommand('workbench.action.closeActiveEditor')

    this.disposables.forEach((disposable) => disposable.dispose())
    this.disposables = []

    this.document = null
  }

  private getEditorText(document: TextDocument): Promise<string | null> {
    const initialVersion = document.version
    let isSaved = false

    return new Promise((resolve) => {
      const disposeVisible = window.onDidChangeVisibleTextEditors((editors) => {
        const isEditorClosed = !editors.find((editor) => editor.document === document)

        if (!isEditorClosed || !isSaved) return

        resolve(null)
      })

      const disposeSave = workspace.onDidSaveTextDocument((savedDocument) => {
        if (savedDocument !== document) return
        if (initialVersion === savedDocument.version) {
          resolve(null)
          return
        }

        isSaved = true
        resolve(savedDocument.getText())
      })

      this.disposables.push(disposeVisible, disposeSave)
    })
  }
}
