import initConfig from '../../../config/init/water-drop.json';
import chalk from 'chalk';
import { happyLog, addTemplateToConfig, getAppConfig } from '../../utils/utils.js';
import fs from 'fs-extra';
import path from 'path';
import mkdirp from 'mkdirp';

export default function template(options = {}) {
    const { name, silent, flags = {} } = options;

    if (!name || flags.help || flags.info) {
        return help();
    }

    if (flags.delete) {
        deleteTemplate(name, silent);
    } else {
        createTemplate(name, silent);
    }
}

export function createTemplate(name, silent) {
    try {
        const templateFolder = process.cwd() + '/' + initConfig._tFolder + '/' + name;
        const templateFolderFiles = templateFolder + '/__files';
        const configFolder = path.resolve(__dirname + '/../../../config');

        mkdirp.sync(templateFolder);
        mkdirp.sync(templateFolderFiles);
        fs.copySync(
            configFolder + `/init/exampleModule/config.json`,
            templateFolder + '/config.json'
        );
        fs.copySync(
            configFolder + `/init/exampleModule/__files/example.js`,
            templateFolderFiles + '/example.js'
        );

        const appConfig = getAppConfig();
        if (appConfig.templates.includes(name)) {
            console.log(chalk.yellow(`${name} template already exists`));
            console.log(chalk.yellow('Abort...'));
            return;
        }

        addTemplateToConfig(name);

        if (!silent) {
            happyLog(`💧     Template "${name}" was created.   💧`);
        }
    } catch (error) {
        console.log(chalk.red(`Failed to create a template: ${error}`));
        console.log(chalk.red('Exiting...'));
        console.log('\n');
    }
}

export function deleteTemplate(name, silent) {
    try {
        const appConfig = getAppConfig();
        if (!appConfig.templates.includes(name)) {
            console.log(chalk.yellow(`${name} template does not exists`));
            console.log(chalk.yellow('Abort...'));
            console.log('\n');
            return;
        }

        const templateFolder = process.cwd() + '/' + initConfig._tFolder + '/' + name;

        fs.removeSync(templateFolder);

        if (!silent) {
            happyLog(`💧     Removed "${name}" template   💧`);
        }
    } catch (error) {
        console.log(chalk.red(`Failed to un-initialize water-drop: ${error}`));
        console.log(chalk.red('Exiting...'));
        console.log('\n');
    }
}

export function help() {
    console.log(
        chalk.white(
            `
USAGE
    $ water-drop template [name]

OPTIONS
    -d, --delete        Deletes template type

EXAMPLES
    $ water-drop template mySecondShinyModule

    $ water-drop template moduleToRemove -d
`
        )
    );
}
