import {Uri} from 'vscode'
import {OVERWRITE_STRATEGIES} from '../../constants'
import {TOverwriteStrategy, INotifyService} from '../../types'
import {AskForConfirmationStrategy} from './StrategyAskConfirm'
import {ForceCreateStrategy} from './StrategyForceCreate'
import {SkipCreateStrategy} from './StrategySkipCreate'

export class OverwriteStrategyService {
  private readonly strategy: TOverwriteStrategy

  constructor(overwriteStrategy?: TOverwriteStrategy) {
    this.strategy = overwriteStrategy ?? OVERWRITE_STRATEGIES.withConfirm
  }

  shouldOverwrite(): boolean {
    return this.strategy === OVERWRITE_STRATEGIES.force
  }

  shouldAskForConfirmation(): boolean {
    return this.strategy === OVERWRITE_STRATEGIES.withConfirm
  }

  shouldSkipRewrite(): boolean {
    return this.strategy === OVERWRITE_STRATEGIES.none
  }

  createFile(fileName: string, currentDir: Uri, notifier: INotifyService): Promise<void> {
    if (this.shouldOverwrite()) return new ForceCreateStrategy().createFile(fileName, currentDir)
    if (this.shouldSkipRewrite()) return new SkipCreateStrategy().createFile(fileName, currentDir)
    else return new AskForConfirmationStrategy().createFile(fileName, currentDir, notifier)
  }

  createFolder(folderName: string, currentDir: Uri, notifier: INotifyService): Promise<void> {
    if (this.shouldOverwrite()) return new ForceCreateStrategy().createFolder(folderName, currentDir)
    if (this.shouldSkipRewrite()) return new SkipCreateStrategy().createFolder(folderName, currentDir)
    else return new AskForConfirmationStrategy().createFolder(folderName, currentDir, notifier)
  }
}
