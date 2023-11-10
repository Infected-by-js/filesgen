import {Uri} from 'vscode'
import {OVERWRITE_STRATEGIES} from '../../constants'
import {TOverwriteStrategy, INotifyService, IOverwriteStrategyService, OverwriteStrategyMap} from '../../types'
import {AskForConfirmationStrategy} from './StrategyAskConfirm'
import {ForceCreateStrategy} from './StrategyForceCreate'
import {SkipCreateStrategy} from './StrategySkipCreate'

export class OverwriteStrategyService {
  private strategy: IOverwriteStrategyService
  private readonly StrategyMap: OverwriteStrategyMap = {
    [OVERWRITE_STRATEGIES.force]: () => new ForceCreateStrategy(),
    [OVERWRITE_STRATEGIES.withConfirm]: () => new AskForConfirmationStrategy(),
    [OVERWRITE_STRATEGIES.none]: () => new SkipCreateStrategy(),
  }

  constructor(overwriteStrategy?: TOverwriteStrategy) {
    const strategyName = overwriteStrategy ?? OVERWRITE_STRATEGIES.withConfirm
    this.strategy = this.StrategyMap[strategyName]()
  }

  createFile(fileName: string, currentDir: Uri, notifier: INotifyService): Promise<boolean> {
    return this.strategy.createFile(fileName, currentDir, notifier)
  }

  createFolder(folderName: string, currentDir: Uri, notifier: INotifyService): Promise<boolean> {
    return this.strategy.createFolder(folderName, currentDir, notifier)
  }
}
