import chalk from 'chalk';

export function happyLog(...args) {
    console.log(chalk.blueBright(...args));
    console.log('\n');
}

export function hardExit() {
    process.exit(0);
}

export function toUnderscore(value) {
    return value.replace(/([A-Z])/g, function($1) {
        return '_' + $1.toLowerCase();
    });
}
