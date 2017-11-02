import chalk from 'chalk';
import appConfig from '../../config/config.json';
import path from 'path';
import fs from 'fs';

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

export function getAppConfigPath() {
    return path.resolve(process.cwd() + '/' + appConfig.configFileName);
}

export function getAppConfig() {
    let contents;
    try {
        contents = fs.readFileSync(getAppConfigPath(), appConfig.fileEncoding);
    } catch (error) {
        console.log(chalk.red(`...."getAppConfig()" failed with ${error}`));
        console.log(chalk.red('Exiting...'));
        return;
    }

    return JSON.parse(contents);
}
