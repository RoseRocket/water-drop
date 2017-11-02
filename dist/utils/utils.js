'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.happyLog = happyLog;
exports.hardExit = hardExit;
exports.toUnderscore = toUnderscore;
exports.getAppConfigPath = getAppConfigPath;
exports.getAppConfig = getAppConfig;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('../../config/config.json');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function happyLog() {
    console.log(_chalk2.default.blueBright.apply(_chalk2.default, arguments));
    console.log('\n');
}

function hardExit() {
    process.exit(0);
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
        contents = _fs2.default.readFileSync(getAppConfigPath(), _config2.default.fileEncoding);
    } catch (error) {
        console.log(_chalk2.default.red('...."getAppConfig()" failed with ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        return;
    }

    return JSON.parse(contents);
}