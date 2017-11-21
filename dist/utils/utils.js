'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.happyLog = happyLog;
exports.toUnderscore = toUnderscore;
exports.getAppConfigPath = getAppConfigPath;
exports.getAppConfig = getAppConfig;
exports.setAppConfig = setAppConfig;
exports.genAppConfig = genAppConfig;
exports.checkIfConfigExists = checkIfConfigExists;
exports.addTemplateToConfig = addTemplateToConfig;
exports.removeTemplateFromConfig = removeTemplateFromConfig;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('../../config/config.json');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function happyLog() {
    console.log(_chalk2.default.blueBright.apply(_chalk2.default, arguments));
    console.log('\n');
}

function toUnderscore(value) {
    return value.replace(/([A-Z])/g, function ($1) {
        return '_' + $1.toLowerCase();
    });
}

function getAppConfigPath() {
    return _path2.default.resolve(process.cwd() + '/' + _config2.default.configFileName);
}

function getAppConfig() {
    var contents = void 0;
    try {
        contents = _fsExtra2.default.readFileSync(getAppConfigPath(), _config2.default.fileEncoding);
    } catch (error) {
        console.log(_chalk2.default.red('...."getAppConfig()" failed with ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        return;
    }

    return JSON.parse(contents);
}

function setAppConfig(contents) {
    if (!checkIfConfigExists()) {
        console.log(_chalk2.default.red('...."setAppConfig()" cannot find water-drop config'));
        console.log(_chalk2.default.red('Exiting...'));
        return;
    }

    try {
        _fsExtra2.default.writeFileSync(getAppConfigPath(), contents, _config2.default.fileEncoding);
    } catch (error) {
        console.log(_chalk2.default.red('...."setAppConfig()" failed with ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        return;
    }
}

function genAppConfig() {
    try {
        var configFolder = _path2.default.resolve(__dirname + '/../../config');
        _fsExtra2.default.copySync(configFolder + '/init/water-drop.json', getAppConfigPath());
    } catch (error) {
        console.log(_chalk2.default.red('...."genAppConfig()" cannot create water-drop config with error ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        return;
    }
}

function checkIfConfigExists() {
    return _fsExtra2.default.existsSync(getAppConfigPath());
}

function addTemplateToConfig(name) {
    try {
        var appConfig = getAppConfig();

        var newConfig = _extends({}, appConfig, {
            templates: [].concat(_toConsumableArray(appConfig.templates), [name])
        });

        setAppConfig(JSON.stringify(newConfig, null, _config2.default.jsonTabs));
    } catch (error) {
        console.log(_chalk2.default.red('...."addTemplateToConfig()" failed to add a template to config with error ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        return;
    }
}

function removeTemplateFromConfig(name) {
    try {
        var appConfig = getAppConfig();

        var newConfig = _extends({}, appConfig, {
            templates: appConfig.templates.filter(function (template) {
                return template !== name;
            })
        });

        setAppConfig(JSON.stringify(newConfig, null, _config2.default.jsonTabs));
    } catch (error) {
        console.log(_chalk2.default.red('...."addTemplateToConfig()" failed to add a template to config with error ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        return;
    }
}