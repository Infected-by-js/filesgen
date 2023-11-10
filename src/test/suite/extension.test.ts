import * as assert from 'assert'
import * as vscode from 'vscode'
import * as sinon from 'sinon'
import * as fileGenerator from '../../extension'
import ConfigService from '../../services/config'
import FilesGenerationService from '../../services/files-generation'
import NotifyService from '../../services/notify'
import {test} from 'mocha'
import {EXTENSTION_NAME, CONFIG_KEY_PRESETS} from '../../constants'

suite('Extension Test Suite', () => {
  let sandbox: sinon.SinonSandbox
  const presetsMock = JSON.stringify({
    preset1: ['file1.ts', 'file2.ts'],
    preset2: [{folder1: ['file1.ts', 'file2.ts']}, {folder2: ['file1.ts', 'file2.ts']}],
    preset3: {
      folder1: ['file1.ts', 'file2.ts'],
      folder2: ['file1.ts', 'file2.ts', {folder3: ['file1.ts', 'file2.ts']}],
    },
  })

  setup(() => {
    sandbox = sinon.createSandbox()
  })

  teardown(() => {
    sandbox.restore()
  })

  fileGenerator.activate({
    subscriptions: [] as vscode.Disposable[],
    workspaceState: {} as vscode.Memento,
    extensionPath: '',
  } as vscode.ExtensionContext)
  /*
    === CONFIG ===
    1) Config not exist
    2) Empty config
    3) Empty config with array as value // filesgen.presets: []
    4) Empty config with object as value // filesgen.presets: {}

    === DESTINATION ===
    1) Destination not selected
    2) Destination selected

    === SELECT PRESET ===
    1) Config is array
    1.2) Preset used as default
    2) Config is object
    2.1) Preset not selected
    2.2) Preset selected

    === OVERWRITE STRATEGY ===
    1) Force overwrite
    2) Skip is files or folders exist
    3) Ask for confirmation is files or folders exist
  */

  test('Config not exist', async () => {
    const showInformationMessageStub = sandbox.stub(vscode.window, 'showInformationMessage')

    await vscode.commands.executeCommand('filesgen.generateFiles', vscode.Uri.parse(''))

    assert.ok(showInformationMessageStub.calledOnce)
    assert.strictEqual(
      showInformationMessageStub.args[0][0],
      `Nothing to generate. Create a [config](command:workbench.action.openSettings?%22${EXTENSTION_NAME}.${CONFIG_KEY_PRESETS}%22) first.`
    )
  })

  test('generateFiles', async () => {
    const uriMock: vscode.Uri = {path: '/fake/path', scheme: 'file', fsPath: '/fake/path'} as vscode.Uri

    const showEmptyConfigMessageStub = sandbox.stub(NotifyService.prototype, 'showEmptyConfigMessage')
    const getDestinationStub = sandbox.stub(NotifyService.prototype, 'getDestination').resolves(uriMock)
    const selectPresetStub = sandbox.stub(NotifyService.prototype, 'selectPreset').resolves('preset1')

    const isConfigEmptyStub = sandbox.stub(ConfigService.prototype, 'isConfigEmpty').returns(false)
    const getPresetsNamesStub = sandbox.stub(ConfigService.prototype, 'getPresetsNames').returns(['preset1', 'preset2'])

    const getOverwriteStrategyStub = sandbox.stub(ConfigService.prototype, 'getOverwriteStrategy').returns('force')

    const generateStub = sandbox.stub(FilesGenerationService.prototype, 'generate')

    await vscode.commands.executeCommand('filesgen.generateFiles', uriMock)

    assert.ok(getDestinationStub.calledOnce)
    assert.ok(selectPresetStub.calledOnce)
    assert.ok(isConfigEmptyStub.calledOnce)
    assert.ok(getPresetsNamesStub.calledOnce)
    assert.ok(getOverwriteStrategyStub.calledOnce)
    assert.ok(generateStub.calledOnceWithExactly(uriMock, 'preset1'))
    assert.ok(showEmptyConfigMessageStub.notCalled)
  })
})
