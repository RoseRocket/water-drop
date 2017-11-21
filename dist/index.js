'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = waterDrop;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('./utils/utils.js');

var _config = require('../config/config.json');

var _config2 = _interopRequireDefault(_config);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMAND_INIT = 'init';
var COMMAND_UNINIT = 'uninit';
var COMMAND_TEMPLATE = 'template';
var COMMAND_LIST = 'list';
var COMMAND_CREATE = 'create';

// MAIN EXECUTION FUNCTION
function waterDrop(commands) {
    var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var command = commands[0];

    console.log('\n');

    if (!command) {
        console.log(_chalk2.default.white('Run: "water-drop --help" to find all available commands.'));
        console.log('\n');

        return;
    }

    if (!_config2.default.commands.includes(command)) {
        console.log(_chalk2.default.white('Unknown command ' + command));
        console.log(_chalk2.default.white('Run: "water-drop --help" to find all available commands.'));
        console.log('\n');

        return;
    }

    // If init option was passed but config is already there
    if (!flags.info && command === COMMAND_INIT && (0, _utils.checkIfConfigExists)()) {
        console.log(_chalk2.default.yellow('water-drop was already initialized in this folder'));
        console.log(_chalk2.default.yellow('Abort...'));
        console.log('\n');

        return;
    }

    // we want to clean the existing structure
    if (command === COMMAND_UNINIT) {
        return _commands2.default.uninit({ flags: flags });
    }

    // we want to create initial structure
    if (command === COMMAND_INIT) {
        return _commands2.default.init({ flags: flags });
    }

    // First check that the folder where we execute water-drop has config file within
    if (!flags.info && !(0, _utils.checkIfConfigExists)()) {
        console.log(_chalk2.default.white('Current folder was not initialized with water-drop'));
        console.log(_chalk2.default.white('Run: "water-drop init" to create initial setup.'));
        console.log('\n');

        return;
    }

    // we want to create new template
    if (command === COMMAND_TEMPLATE) {
        return _commands2.default.template({ name: commands[1], flags: flags });
    }

    // we want to list all available templates
    if (command === COMMAND_LIST) {
        return _commands2.default.list({ flags: flags });
    }

    // we want to create a new module based on one of our templates
    if (command === COMMAND_CREATE) {
        return _commands2.default.create({ name: commands[1], flags: flags });
    }
}