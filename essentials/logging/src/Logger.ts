import chalk, { ChalkInstance } from 'chalk'

export class Logger {
  static log(fun: ChalkInstance, level: string, label: string, msg: string) {
    console.log(fun(`[${level.toUpperCase()}/${label}] `) + msg)
  }

  static info(label: string, msg: string) {
    Logger.log(chalk.blue, 'info', label, msg)
  }

  static warn(label: string, msg: string) {
    Logger.log(chalk.yellow, 'warning', label, msg)
  }

  static error(label: string, msg: string) {
    Logger.log(chalk.red, 'error', label, msg)
  }

  static showStopper(label: string, msg: string) {
    Logger.log(chalk.magentaBright, 'showstopper', label, msg)
  }
}
