'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = init;
exports.help = help;

var _waterDrop = require('../../../config/init/water-drop.json');

var _waterDrop2 = _interopRequireDefault(_waterDrop);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('../../utils/utils.js');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _uninit = require('../uninit');

var _uninit2 = _interopRequireDefault(_uninit);

var _template = require('../template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$flags = options.flags,
        flags = _options$flags === undefined ? {} : _options$flags;


    if (flags.help || flags.info) {
        return help();
    }

    try {
        // clean the folder first just in case it has some files and folders leftovers
        (0, _uninit2.default)({ silent: true });

        (0, _utils.genAppConfig)();

        (0, _template2.default)({ name: 'exampleModule' });

        (0, _utils.happyLog)('💧     This folder has a water-drop config now. You can create templates now. Run "water-drop -h" what other commands you can run.   💧');
    } catch (error) {
        console.log(_chalk2.default.red('Failed to create initial config with error: ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');
    }
}

function help() {
    console.log(_chalk2.default.white('\nUSAGE\n    $ water-drop init\n\nEXAMPLES\n    $ water-drop init\n'));
}