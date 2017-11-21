import initConfig from '../../../config/init/water-drop.json';
import chalk from 'chalk';
import { getAppConfig } from '../../utils/utils.js';

export default function list(options = {}) {
    const { flags = {} } = options;

    if (flags.help || flags.info) {
        return help();
    }

    const moduleConfig = getAppConfig();
    console.log(
        chalk.blueBright(
            'Available templates: ',
            chalk.yellow.bgBlue.bold(moduleConfig.templates.join(' '))
        )
    );
    console.log('\n');
}

export function help() {
    console.log(
        chalk.white(
            `
USAGE
    $ water-drop list

EXAMPLES
    $ water-drop list
`
        )
    );
}
