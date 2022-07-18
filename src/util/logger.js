const chalk = require('chalk');
const symbols = require('log-symbols');
module.exports = {
    success: (message) => {
        const arr = split(message);
        for (const line of arr) {
            console.log(`${chalk.bold.magenta(timestamp())} ${chalk.gray('•')} ${symbols.success} ${chalk.gray('•')} ${chalk.green(line)}`);
        }
    },
    info: (message) => {
        const arr = split(message);
        for (const line of arr) {
            console.log(`${chalk.bold.magenta(timestamp())} ${chalk.gray('•')} ${symbols.info} ${chalk.gray('•')} ${chalk.blue(line)}`);
        }
    },
    warn: (message) => {
        const arr = split(message);
        for (const line of arr) {
            console.log(`${chalk.bold.magenta(timestamp())} ${chalk.gray('•')} ${symbols.warning} ${chalk.gray('•')} ${chalk.yellow(line)}`);
        }
    },
    error: (message) => {
        const arr = split(message);
        for (const line of arr) {
            console.log(`${chalk.bold.magenta(timestamp())} ${chalk.gray('•')} ${symbols.error} ${chalk.gray('•')} ${chalk.red(line)}`);
        }
    }
};
function timestamp () {
    const date = new Date();
    return date.toLocaleString('en-US', {
        hour12: false,
        timeZone: 'Asia/Singapore',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
function split (x) {
    return x.toString().split('\n');
}