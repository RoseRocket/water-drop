import chalk from 'chalk';
import { checkIfConfigExists } from './utils/utils.js';
import appConfig from '../config/config.json';
import cliCommands from './commands';

const COMMAND_INIT = 'init';
const COMMAND_UNINIT = 'uninit';
const COMMAND_TEMPLATE = 'template';
const COMMAND_LIST = 'list';
const COMMAND_CREATE = 'create';

// MAIN EXECUTION FUNCTION
export default function waterDrop(commands, flags = {}) {
    const command = commands[0];

    console.log('\n');

    if (!command) {
        console.log(chalk.white('Run: "water-drop --help" to find all available commands.'));
        console.log('\n');

        return;
    }

    if (!appConfig.commands.includes(command)) {
        console.log(chalk.white(`Unknown command ${command}`));
        console.log(chalk.white('Run: "water-drop --help" to find all available commands.'));
        console.log('\n');

        return;
    }

    // If init option was passed but config is already there
    if (!flags.info && command === COMMAND_INIT && checkIfConfigExists()) {
        console.log(chalk.yellow('water-drop was already initialized in this folder'));
        console.log(chalk.yellow('Abort...'));
        console.log('\n');

        return;
    }

    // we want to clean the existing structure
    if (command === COMMAND_UNINIT) {
        return cliCommands.uninit({ flags });
    }

    // we want to create initial structure
    if (command === COMMAND_INIT) {
        return cliCommands.init({ flags });
    }

    // First check that the folder where we execute water-drop has config file within
    if (!flags.info && !checkIfConfigExists()) {
        console.log(chalk.white('Current folder was not initialized with water-drop'));
        console.log(chalk.white('Run: "water-drop init" to create initial setup.'));
        console.log('\n');

        return;
    }

    // we want to create new template
    if (command === COMMAND_TEMPLATE) {
        return cliCommands.template({ name: commands[1], flags });
    }

    // we want to list all available templates
    if (command === COMMAND_LIST) {
        return cliCommands.list({ flags });
    }

    // we want to create a new module based on one of our templates
    if (command === COMMAND_CREATE) {
        return cliCommands.create({ name: commands[1], flags });
    }
}
