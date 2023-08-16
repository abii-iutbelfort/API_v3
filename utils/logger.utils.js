import chalk from "chalk";

function info(message) {
  console.log(chalk`{blue.bold [INFO]}\t\t${message}`);
}

function error(message, error = "") {
  let errorString = chalk`{red.bold [ERROR]}\t\t${message}`;
  if (error) {
    errorString += `\n${error}`;
  }
  console.error(errorString);
}

function warn(message) {
  console.warn(chalk`{yellow.bold [WARN]}\t\t${message}`);
}

function success(message) {
  console.log(chalk`{green.bold [SUCCESS]}\t${message}`);
}

export default { info, error, warn, success };
