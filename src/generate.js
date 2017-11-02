const argv = require('minimist')(process.argv.slice(2));
import chalk from 'chalk';
import stepCmds from './stepCmds';
import { hardExit, happyLog, getAppConfigPath, getAppConfig } from './utils/utils.js';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import initConfig from '../config/.water_drop.json';
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

export default function generate(options = {}) {
    console.log('\n');

    // If init option was passed then we want to create initial structure
    if (initArg) {
        return generateInitConfig();
    }

    // First check that the folder where we execute water-drop has config file within
    if (!checkIfConfigExists()) {
        console.log(
            chalk.red('Looks like the current folder does not have water-drop config file within.')
        );
        console.log(
            chalk.red('Run: "water-drop --init" to create basic config file and a template folder.')
        );
        console.log(chalk.red('Exiting...'));
        console.log('\n');

        hardExit();
    }

    // read config file
    let config = getAppConfig();
    if (!config) {
        hardExit();
    }

    const { vars: configVars } = config;

    // Parse CLI args and be sure that they make sense
    if (
        !parseCLIArgs(
            { helpArg, listArg, templateType, templateName, templatePath },
            Object.keys(config.templates)
        )
    ) {
        hardExit();
    }

    happyLog('I know this template ! --> ', chalk.yellow.bgBlue.bold(templateType));

    const templateConfig = config.templates[templateType];
    const { steps = [], vars: templateVars } = templateConfig;

    // create HBS context
    const context = {
        ...configVars,
        ...templateVars,
        templateType,
        templateName,
        templatePath,
        waterDropTemplateFolder: config.waterDropTemplateFolder,
        openTag: config.openTag,
        closeTag: config.closeTag,
    };

    // Pre-parse steps to be sure config is alright before we start moving files around
    if (!preParseSteps(steps)) {
        hardExit();
    }

    // Start moving files around
    createTemplate({ context, steps, isVerbose: verboseArg });

    happyLog('✨ ✨ ✨     The work is complete and the template was created!    ✨ ✨ ✨');
}

export function checkIfConfigExists() {
    return fs.existsSync(getAppConfigPath());
}

export function generateInitConfig() {
    try {
        fs.writeFileSync(
            getAppConfigPath(),
            JSON.stringify(initConfig, null, appConfig.jsonTabs),
            appConfig.fileEncoding
        );

        mkdirp.sync(process.cwd() + '/' + initConfig.waterDropTemplateFolder + '/example');

        happyLog(
            '💧     This folder has a water-drop config now. You can create templates now. Run "water-drop -h" to learn more.   💧'
        );
    } catch (error) {
        console.log(chalk.red(`Failed to create initial config with error: ${error}`));
        console.log(chalk.red('Exiting...'));
        console.log('\n');

        hardExit();
    }
}

export function parseCLIArgs(args = {}, templateTypes) {
    const { helpArg, listArg, templateType, templateName, templatePath } = args;

    if (helpArg) {
        console.log(
            chalk.blueBright('node app.js [-v] -t <template_type> -n <template_name> -p <path>')
        );
        console.log('\n');
        console.log(chalk.blueBright('node app.js --list (To see all available template types)'));
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

    if (!templateType) {
        console.log(chalk.red('Uh oh. You forgot to specify <template_type>!'));
        console.log(chalk.red('Run      node app.js -h      to find on how to use this tool'));
        console.log(
            chalk.red(
                'water-drop found the following templates: ',
                chalk.yellow.bgRed.bold(templateTypes.join(' '))
            )
        );
        console.log(chalk.red('Example for path: ', chalk.yellow.bgRed.bold('/admin/customers')));
        console.log(chalk.red('Exiting...'));
        console.log('\n');

        return;
    }

    if (!templateTypes.includes(templateType)) {
        console.log(chalk.red('Uh oh. I do not know this <template_type>!'));
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
        console.log(chalk.red('Uh oh. I need a <template_name> to work correctly!'));
        console.log(chalk.red('Run: node app.js -h to find on how to use this tool'));
        console.log(chalk.red('Exiting...'));
        console.log('\n');

        return;
    }

    if (!templatePath) {
        console.log(chalk.red('Uh oh. I need a <path> to work correctly!'));
        console.log(chalk.red('Run: node app.js -h to find on how to use this tool'));
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
            hardExit();
        }
    }
}
