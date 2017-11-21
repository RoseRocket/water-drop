'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = uninit;
exports.help = help;

var _waterDrop = require('../../../config/init/water-drop.json');

var _waterDrop2 = _interopRequireDefault(_waterDrop);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('../../utils/utils.js');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function uninit() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var silent = options.silent,
        _options$flags = options.flags,
        flags = _options$flags === undefined ? {} : _options$flags;


    if (flags.help || flags.info) {
        return help();
    }

    try {
        _fsExtra2.default.removeSync((0, _utils.getAppConfigPath)());
        _fsExtra2.default.removeSync(process.cwd() + '/' + _waterDrop2.default._tFolder);

        if (!silent) {
            (0, _utils.happyLog)('💧     water-drop and all of its directories were removed   💧');
        }
    } catch (error) {
        console.log(_chalk2.default.red('Failed to un-initialize water-drop: ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');
    }
}

function help() {
    console.log(_chalk2.default.white('\nUSAGE\n    $ water-drop uninit\n\nEXAMPLES\n    $ water-drop uninit\n'));
}