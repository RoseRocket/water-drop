import globalConfig from '../../../config/config.json';
import chalk from 'chalk';
import { happyLog, getAppConfig } from '../../utils/utils.js';
import fs from 'fs-extra';
import stepCmds from '../../stepCmds';
import path from 'path';
import mkdirp from 'mkdirp';
import uninit from '../uninit';
import template from '../template';

export default function create(options = {}) {
    const { name, flags = {} } = options;

    if (!name || flags.help || flags.info) {
        return help();
    }

    try {
        // read config file
        let config = getAppConfig();
        if (!config) {
            return;
        }

        const { vars: configVars } = config;

        if (flags.help || !flags.type) {
            return help();
        }

        if (!config.templates.includes(flags.type)) {
            console.log(chalk.yellow(`Uh oh. I do not know "${flags.type}" template.`));
            console.log(chalk.yellow('Abort...'));
            console.log('\n');

            return;
        }

        if (!flags.path) {
            return help();
        }

        happyLog('I know this 💧  template ! --> ', chalk.yellow.bgBlue.bold(flags.type));

        const moduleConfigPath =
            process.cwd() + '/' + config._tFolder + '/' + flags.type + '/config.json';
        const contents = fs.readFileSync(moduleConfigPath, globalConfig.fileEncoding);

        const templateConfig = JSON.parse(contents);
        const { steps = [], vars: templateVars } = templateConfig;

        // create HBS context
        const context = {
            ...configVars,
            ...templateVars,
            _mType: flags.type,
            _mName: name,
            _mPath: flags.path,
            _tFolder: config._tFolder,
            _tOpenTag: config._tOpenTag,
            _tCloseTag: config._tCloseTag,
        };

        // Pre-parse steps to be sure config is alright before we start moving files around
        if (!preParseSteps(steps)) {
            return;
        }

        // Start moving files around
        if (!createTemplate({ context, steps, isVerbose: flags.verbose })) {
            return;
        }

        happyLog('✨ ✨ ✨     The work is complete and your template was created!    ✨ ✨ ✨');
    } catch (error) {
        console.log(chalk.red(`Failed to create module: "${name}" with error ${error}`));
        console.log(chalk.red('Exiting...'));
        console.log('\n');
    }
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

export function parseCLIArgs(flags = {}, templateTypes) {
    if (flags.help || !flags.type) {
        return help();
    }

    if (!templateTypes.includes(flags.type)) {
        console.log(chalk.yellow(`Uh oh. I do not know "${flags.type}" template.`));
        console.log(chalk.yellow('Abort...'));
        console.log('\n');

        return;
    }

    if (!flags.name) {
        return help();
    }

    if (!flags.path) {
        return help();
    }

    return true;
}

export function help() {
    console.log(
        chalk.white(
            `
USAGE
    $ water-drop create <moduleName>

OPTIONS
    -t, --type        Template type
    -p, --path        Module path in a project tree
    -v, --verbose     Make execution verbose to see what is happening

EXAMPLES
    $ water-drop create myNewShinyModule -t exampleModule -p path/within/my/project -v
`
        )
    );
}
