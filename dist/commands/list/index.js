'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = list;
exports.help = help;

var _waterDrop = require('../../../config/init/water-drop.json');

var _waterDrop2 = _interopRequireDefault(_waterDrop);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('../../utils/utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function list() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$flags = options.flags,
        flags = _options$flags === undefined ? {} : _options$flags;


    if (flags.help || flags.info) {
        return help();
    }

    var moduleConfig = (0, _utils.getAppConfig)();
    console.log(_chalk2.default.blueBright('Available templates: ', _chalk2.default.yellow.bgBlue.bold(moduleConfig.templates.join(' '))));
    console.log('\n');
}

function help() {
    console.log(_chalk2.default.white('\nUSAGE\n    $ water-drop list\n\nEXAMPLES\n    $ water-drop list\n'));
}