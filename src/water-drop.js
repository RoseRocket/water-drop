const argv = require('minimist')(process.argv.slice(2));
import chalk from 'chalk';
import stepCmds from './stepCmds';
import { happyLog, getAppConfigPath, getAppConfig } from './utils/utils.js';
import fs from 'fs-extra';
import mkdirp from 'mkdirp';
import path from 'path';
import initConfig from '../config/water-drop.json';
import appConfig from '../config/config.json';

const {
    t: templateType,
    n: templateName,
    p: templatePath,
    h: helpArg,
    v: verboseArg,
    init: initArg,
    list: listArg,
} = argv;

// MAIN EXECUTION FUNCTION
export default function run(options = {}) {
    console.log('\n');

    // If init option was passed then we want to create initial structure
    if (initArg) {
        return generateInitConfig();
    }

    // First check that the folder where we execute water-drop has config file within
    if (!checkIfConfigExists()) {
        return;
    }

    // read config file
    let config = getAppConfig();
    if (!config) {
        return;
    }

    const { vars: configVars } = config;

    // Parse CLI args and be sure that they make sense
    if (
        !parseCLIArgs(
            { helpArg, listArg, templateType, templateName, templatePath },
            Object.keys(config.templates)
        )
    ) {
        return;
    }

    happyLog('I know this 💧  template ! --> ', chalk.yellow.bgBlue.bold(templateType));

    const templateConfig = config.templates[templateType];
    const { steps = [], vars: templateVars } = templateConfig;

    // create HBS context
    const context = {
        ...configVars,
        ...templateVars,
        _mType: templateType,
        _mName: templateName,
        _mPath: templatePath,
        _tFolder: config._tFolder,
        _tOpenTag: config._tOpenTag,
        _tCloseTag: config._tCloseTag,
    };

    // Pre-parse steps to be sure config is alright before we start moving files around
    if (!preParseSteps(steps)) {
        return;
    }

    // Start moving files around
    if (!createTemplate({ context, steps, isVerbose: verboseArg })) {
        return;
    }

    happyLog('✨ ✨ ✨     The work is complete and your template was created!    ✨ ✨ ✨');
}

export function checkIfConfigExists() {
    const exists = fs.existsSync(getAppConfigPath());

    if (!exists) {
        console.log(
            chalk.red('Looks like the current folder does not have water-drop config file within.')
        );
        console.log(
            chalk.red('Run: "water-drop --init" to create basic config file and a template folder.')
        );
        console.log(chalk.red('Exiting...'));
        console.log('\n');
    }

    return exists;
}

export function generateInitConfig() {
    try {
        const exampleFolder = process.cwd() + '/' + initConfig._tFolder + '/example';
        const configFolder = path.resolve(__dirname + '/../config');

        mkdirp.sync(exampleFolder);
        fs.copySync(configFolder + '/example.js', exampleFolder + '/example.js');
        fs.copySync(configFolder + '/water-drop.json', getAppConfigPath());

        happyLog(
            '💧     This folder has a water-drop config now. You can create templates now. Run "water-drop -h" to learn more.   💧'
        );
    } catch (error) {
        console.log(chalk.red(`Failed to create initial config with error: ${error}`));
        console.log(chalk.red('Exiting...'));
        console.log('\n');
    }
}

export function parseCLIArgs(args = {}, templateTypes) {
    const { helpArg, listArg, templateType, templateName, templatePath } = args;

    if (helpArg || !templateType) {
        console.log(
            chalk.blueBright(
                'water-drop [-v] -t <new_module_type> -n <new_module_name> -p <new_module_path>'
            )
        );
        console.log('\n');
        console.log(chalk.blueBright('water-drop --list (To see all available template types)'));
        console.log('\n');
        console.log(
            chalk.blueBright(
                'water-drop found the following templates: ',
                chalk.yellow.bgBlue.bold(templateTypes.join(' '))
            )
        );
        console.log(
            chalk.blueBright('Example for name: ', chalk.yellow.bgBlue.bold('MyNewShinyModule'))
        );
        console.log(
            chalk.blueBright('Example for path: ', chalk.yellow.bgBlue.bold('/admin/customers'))
        );
        console.log('\n');

        return;
    }

    if (listArg) {
        console.log(
            chalk.blueBright(
                'Available templates: ',
                chalk.yellow.bgBlue.bold(templateTypes.join(' '))
            )
        );
        console.log('\n');

        return;
    }

    if (!templateTypes.includes(templateType)) {
        console.log(chalk.red('Uh oh. I do not know this <new_module_type>!'));
        console.log(
            chalk.red(
                'I only know these templates: ',
                chalk.yellow.bgRed.bold(templateTypes.join(' '))
            )
        );
        console.log(chalk.red('Exiting...'));
        console.log('\n');

        return;
    }

    if (!templateName) {
        console.log(chalk.red('Uh oh. I need a <new_module_name> to work correctly!'));
        console.log(chalk.red('Run: water-drop -h to find on how to use this tool'));
        console.log(chalk.red('Exiting...'));
        console.log('\n');

        return;
    }

    if (!templatePath) {
        console.log(chalk.red('Uh oh. I need a <path> to work correctly!'));
        console.log(chalk.red('Run: water-drop -h to find on how to use this tool'));
        console.log(chalk.red('Exiting...'));
        console.log('\n');

        return;
    }

    return true;
}

export function preParseSteps(steps) {
    for (let step of steps) {
        const { cmd } = step;
        if (!cmd) {
            console.log(
                chalk.red(
                    `"cmd" is missing in step ${JSON.stringify(
                        step
                    )} Please refer to the README to find how to define steps.`
                )
            );
            console.log(chalk.red('Exiting...'));
            console.log('\n');

            return;
        }

        if (!stepCmds[cmd]) {
            console.log(
                chalk.red(
                    `Unknown "cmd" in step ${JSON.stringify(
                        step
                    )} Please refer to the README to find how to define steps.`
                )
            );
            console.log(chalk.red('Exiting...'));
            console.log('\n');

            return;
        }
    }

    return true;
}

export function createTemplate(options = {}) {
    const { steps, context = {}, isVerbose = false } = options;

    // run steps
    for (let step of steps) {
        const { cmd } = step;

        const stepFunction = stepCmds[cmd];

        if (isVerbose) {
            happyLog(`Going to execute "${cmd}" command`);
        }

        const error = stepFunction(step, context, { isVerbose });

        if (error) {
            console.log(chalk.red(`There is an error in ${JSON.stringify(step)}:`));
            console.log(chalk.red(`The error is ${error}:`));
            console.log(chalk.red('Exiting...'));
            console.log('\n');
            return;
        }
    }

    return true;
}
