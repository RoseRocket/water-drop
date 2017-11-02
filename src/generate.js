const argv = require('minimist')(process.argv.slice(2));
import chalk from 'chalk';
import config from '../config/config.json';
import stepCmds from './stepCmds';
import { hardExit, happyLog } from './utils/utils.js';

const { vars: configVars } = config;

const { t: templateType, n: templateName, p: templatePath, h: helpArg, v: verboseArg } = argv;

export default function generate(options = {}) {
    // Parse CLI args and be sure that they make sense
    if (
        !parseCLIArgs(
            { helpArg, templateType, templateName, templatePath },
            Object.keys(config.templates)
        )
    ) {
        hardExit();
    }

    happyLog('I know this template ! --> ', chalk.yellow.bgBlue.bold(templateType));

    const templateConfig = config.templates[templateType];
    const { steps = [], vars: templateVars } = templateConfig;

    // create HBS context
    const context = { ...configVars, ...templateVars, templateType, templateName, templatePath };

    // Pre-parse steps to be sure config is alright before we start moving files around
    if (!preParseSteps(steps)) {
        hardExit();
    }

    // Start moving files around
    createTemplate({ context, steps, isVerbose: verboseArg });

    happyLog('✨ ✨ ✨     The work is complete and the template was created!    ✨ ✨ ✨');
}

export function parseCLIArgs(args = {}, templateTypes) {
    const { helpArg, templateType, templateName, templatePath } = args;

    if (helpArg) {
        console.log(
            chalk.blueBright('Usage: node app.js -t <template_type> -n <template_name> -p <path>')
        );
        console.log(
            chalk.blueBright(
                'I know these templates: ',
                chalk.yellow.bgBlue.bold(templateTypes.join(' '))
            )
        );
        console.log(
            chalk.blueBright('Example for name: ', chalk.yellow.bgBlue.bold('MyNewShinyModule'))
        );
        console.log(
            chalk.blueBright('Example for path: ', chalk.yellow.bgBlue.bold('/admin/customers'))
        );
        console.log(chalk.blueBright('Exiting...'));
        console.log('\n');

        return;
    }

    if (!templateType) {
        console.log(chalk.red('Uh oh. You forgot to specify <template_type>!'));
        console.log(chalk.red('Run: node app.js -h to find on how to use this tool'));
        console.log(
            chalk.red('I know these templates: ', chalk.yellow.bgRed.bold(templateTypes.join(' ')))
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
