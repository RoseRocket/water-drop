'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = template;
exports.createTemplate = createTemplate;
exports.deleteTemplate = deleteTemplate;
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function template() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var name = options.name,
        silent = options.silent,
        _options$flags = options.flags,
        flags = _options$flags === undefined ? {} : _options$flags;


    if (!name || flags.help || flags.info) {
        return help();
    }

    if (flags.delete) {
        deleteTemplate(name, silent);
    } else {
        createTemplate(name, silent);
    }
}

function createTemplate(name, silent) {
    try {
        var templateFolder = process.cwd() + '/' + _waterDrop2.default._tFolder + '/' + name;
        var templateFolderFiles = templateFolder + '/__files';
        var configFolder = _path2.default.resolve(__dirname + '/../../../config');

        _mkdirp2.default.sync(templateFolder);
        _mkdirp2.default.sync(templateFolderFiles);
        _fsExtra2.default.copySync(configFolder + '/init/exampleModule/config.json', templateFolder + '/config.json');
        _fsExtra2.default.copySync(configFolder + '/init/exampleModule/__files/example.js', templateFolderFiles + '/example.js');

        var appConfig = (0, _utils.getAppConfig)();
        if (appConfig.templates.includes(name)) {
            console.log(_chalk2.default.yellow(name + ' template already exists'));
            console.log(_chalk2.default.yellow('Abort...'));
            return;
        }

        (0, _utils.addTemplateToConfig)(name);

        if (!silent) {
            (0, _utils.happyLog)('\uD83D\uDCA7     Template "' + name + '" was created.   \uD83D\uDCA7');
        }
    } catch (error) {
        console.log(_chalk2.default.red('Failed to create a template: ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');
    }
}

function deleteTemplate(name, silent) {
    try {
        var appConfig = (0, _utils.getAppConfig)();
        if (!appConfig.templates.includes(name)) {
            console.log(_chalk2.default.yellow(name + ' template does not exists'));
            console.log(_chalk2.default.yellow('Abort...'));
            console.log('\n');
            return;
        }

        var templateFolder = process.cwd() + '/' + _waterDrop2.default._tFolder + '/' + name;

        _fsExtra2.default.removeSync(templateFolder);

        if (!silent) {
            (0, _utils.happyLog)('\uD83D\uDCA7     Removed "' + name + '" template   \uD83D\uDCA7');
        }
    } catch (error) {
        console.log(_chalk2.default.red('Failed to un-initialize water-drop: ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');
    }
}

function help() {
    console.log(_chalk2.default.white('\nUSAGE\n    $ water-drop template [name]\n\nOPTIONS\n    -d, --delete        Deletes template type\n\nEXAMPLES\n    $ water-drop template mySecondShinyModule\n\n    $ water-drop template moduleToRemove -d\n'));
}