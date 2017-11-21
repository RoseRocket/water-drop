import initConfig from '../../../config/init/water-drop.json';
import chalk from 'chalk';
import { getAppConfigPath, happyLog } from '../../utils/utils.js';
import fs from 'fs-extra';

export default function uninit(options = {}) {
    const { silent, flags = {} } = options;

    if (flags.help || flags.info) {
        return help();
    }

    try {
        fs.removeSync(getAppConfigPath());
        fs.removeSync(process.cwd() + '/' + initConfig._tFolder);

        if (!silent) {
            happyLog('💧     water-drop and all of its directories were removed   💧');
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
    $ water-drop uninit

EXAMPLES
    $ water-drop uninit
`
        )
    );
}
