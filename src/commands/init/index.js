import initConfig from '../../../config/init/water-drop.json';
import chalk from 'chalk';
import { happyLog, genAppConfig } from '../../utils/utils.js';
import fs from 'fs-extra';
import path from 'path';
import mkdirp from 'mkdirp';
import uninit from '../uninit';
import template from '../template';

export default function init(options = {}) {
    const { flags = {} } = options;

    if (flags.help || flags.info) {
        return help();
    }

    try {
        // clean the folder first just in case it has some files and folders leftovers
        uninit({ silent: true });

        genAppConfig();

        template({ name: 'exampleModule' });

        happyLog(
            '💧     This folder has a water-drop config now. You can create templates now. Run "water-drop -h" what other commands you can run.   💧'
        );
    } catch (error) {
        console.log(chalk.red(`Failed to create initial config with error: ${error}`));
        console.log(chalk.red('Exiting...'));
        console.log('\n');
    }
}

export function help() {
    console.log(
        chalk.white(
            `
USAGE
    $ water-drop init

EXAMPLES
    $ water-drop init
`
        )
    );
}
