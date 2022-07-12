import chalk from "chalk";

export class Logger {
  static log(fun, level, label, msg) {
    console.log(fun(`[${level.toUpperCase()}/${label}] `) + msg);
  }

  static info(label, msg) {
    Logger.log(chalk.blue, "info", label, msg);
  }

  static warn(label, msg) {
    Logger.log(chalk.yellow, "warning", label, msg);
  }

  static error(label, msg) {
    Logger.log(chalk.red, "error", label, msg);
  }

  static showStopper(label, msg) {
    Logger.log(chalk.magentaBright, "showstopper", label, msg);
  }
}
