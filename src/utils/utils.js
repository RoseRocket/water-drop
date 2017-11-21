import chalk from 'chalk';
import globalConfig from '../../config/config.json';
import path from 'path';
import fs from 'fs-extra';

export function happyLog(...args) {
    console.log(chalk.blueBright(...args));
    console.log('\n');
}

export function toUnderscore(value) {
    return value.replace(/([A-Z])/g, function($1) {
        return '_' + $1.toLowerCase();
    });
}

export function getAppConfigPath() {
    return path.resolve(process.cwd() + '/' + globalConfig.configFileName);
}

export function getAppConfig() {
    let contents;
    try {
        contents = fs.readFileSync(getAppConfigPath(), globalConfig.fileEncoding);
    } catch (error) {
        console.log(chalk.red(`...."getAppConfig()" failed with ${error}`));
        console.log(chalk.red('Exiting...'));
        return;
    }

    return JSON.parse(contents);
}

export function setAppConfig(contents) {
    if (!checkIfConfigExists()) {
        console.log(chalk.red(`...."setAppConfig()" cannot find water-drop config`));
        console.log(chalk.red('Exiting...'));
        return;
    }

    try {
        fs.writeFileSync(getAppConfigPath(), contents, globalConfig.fileEncoding);
    } catch (error) {
        console.log(chalk.red(`...."setAppConfig()" failed with ${error}`));
        console.log(chalk.red('Exiting...'));
        return;
    }
}

export function genAppConfig() {
    try {
        const configFolder = path.resolve(__dirname + '/../../config');
        fs.copySync(configFolder + '/init/water-drop.json', getAppConfigPath());
    } catch (error) {
        console.log(
            chalk.red(`...."genAppConfig()" cannot create water-drop config with error ${error}`)
        );
        console.log(chalk.red('Exiting...'));
        return;
    }
}

export function checkIfConfigExists() {
    return fs.existsSync(getAppConfigPath());
}

export function addTemplateToConfig(name) {
    try {
        const appConfig = getAppConfig();

        const newConfig = {
            ...appConfig,
            templates: [...appConfig.templates, name],
        };

        setAppConfig(JSON.stringify(newConfig, null, globalConfig.jsonTabs));
    } catch (error) {
        console.log(
            chalk.red(
                `...."addTemplateToConfig()" failed to add a template to config with error ${error}`
            )
        );
        console.log(chalk.red('Exiting...'));
        return;
    }
}

export function removeTemplateFromConfig(name) {
    try {
        const appConfig = getAppConfig();

        const newConfig = {
            ...appConfig,
            templates: appConfig.templates.filter(template => template !== name),
        };

        setAppConfig(JSON.stringify(newConfig, null, globalConfig.jsonTabs));
    } catch (error) {
        console.log(
            chalk.red(
                `...."addTemplateToConfig()" failed to add a template to config with error ${error}`
            )
        );
        console.log(chalk.red('Exiting...'));
        return;
    }
}
