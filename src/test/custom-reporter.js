const Mocha = require('mocha')
const {EVENT_TEST_FAIL, EVENT_RUN_END, EVENT_TEST_PASS, EVENT_SUITE_BEGIN, EVENT_SUITE_END} = Mocha.Runner.constants
const chalk = require('chalk')

class CustomReporter {
  constructor(runner) {
    this._indents = 0

    runner
      .on(EVENT_SUITE_BEGIN, this.onSuiteBegin.bind(this))
      .on(EVENT_SUITE_END, this.onSuiteEnd.bind(this))
      .on(EVENT_TEST_PASS, this.onTestPass.bind(this))
      .on(EVENT_TEST_FAIL, this.onTestFail.bind(this))
  }

  indent() {
    return '  '.repeat(this._indents)
  }

  logPass(message) {
    console.log(`${this.indent()}${chalk.green('✓ Passed -')} ${chalk.green.bold(message)}`)
  }

  logFail(message) {
    console.log(`${this.indent()}${chalk.red('✗ Failed -')} ${chalk.red.bold(message)}`)
  }

  onSuiteBegin(suite) {
    console.log(`${this.indent()}${chalk.bold(suite.title)}`)
    this._indents += 1
  }

  onSuiteEnd() {
    this._indents -= 1
  }

  onTestPass(test) {
    this.logPass(test.title)
  }

  onTestFail(test, err) {
    this.logFail(test.title)

    if (err.expected !== undefined && err.actual !== undefined) {
      console.log(`${this.indent()}${this.indent()}${chalk.red.bold('Expected:')} ${chalk.red(err.expected)}`)
      console.log(`${this.indent()}${this.indent()}${chalk.green.bold('Actual:')} ${chalk.red(err.actual)}`)
    } else {
      console.log(`${this.indent()}${this.indent()} ${chalk.red(err.message)}`)
    }
  }
}

module.exports = CustomReporter
