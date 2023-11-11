import {Uri, workspace} from 'vscode'
import {CONFIG_KEY_OVERWRITE, EXTENSTION_NAME, OVERWRITE_STRATEGIES} from '../../constants'
import {TOverwriteStrategy, INotifyService, IOverwriteStrategyService, OverwriteStrategyMap} from '../../types'
import {AskForConfirmationStrategy} from './StrategyAskConfirm'
import {ForceCreateStrategy} from './StrategyForceCreate'
import {SkipCreateStrategy} from './StrategySkipCreate'

export class OverwriteStrategyService {
  private extName = EXTENSTION_NAME
  private overwriteKey = CONFIG_KEY_OVERWRITE
  private strategy: IOverwriteStrategyService
  private readonly StrategyMap: OverwriteStrategyMap = {
    [OVERWRITE_STRATEGIES.force]: () => new ForceCreateStrategy(),
    [OVERWRITE_STRATEGIES.withConfirm]: () => new AskForConfirmationStrategy(),
    [OVERWRITE_STRATEGIES.none]: () => new SkipCreateStrategy(),
  }

  constructor() {
    const strategyName = this.getConfigOverwriteStrategyName()
    this.strategy = this.StrategyMap[strategyName]()
  }

  private getConfigOverwriteStrategyName(): TOverwriteStrategy {
    const config = workspace.getConfiguration(this.extName)

    return config.get(this.overwriteKey) ?? OVERWRITE_STRATEGIES.withConfirm
  }

  createFile(fileName: string, currentDir: Uri, notifier: INotifyService): Promise<boolean> {
    return this.strategy.createFile(fileName, currentDir, notifier)
  }

  createFolder(folderName: string, currentDir: Uri, notifier: INotifyService): Promise<boolean> {
    return this.strategy.createFolder(folderName, currentDir, notifier)
  }
}
