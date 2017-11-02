'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.happyLog = happyLog;
exports.hardExit = hardExit;
exports.toUnderscore = toUnderscore;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

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