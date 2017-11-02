'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = hbsHelpers;

var _utils = require('./utils.js');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function ucase(value) {
    var _value = _toArray(value),
        firstChar = _value[0],
        rest = _value.slice(1);

    return [firstChar.toUpperCase()].concat(_toConsumableArray(rest)).join('');
}

function lcase(value) {
    var _value2 = _toArray(value),
        firstChar = _value2[0],
        rest = _value2.slice(1);

    return [firstChar.toLowerCase()].concat(_toConsumableArray(rest)).join('');
}

function u_case_all(value) {
    return (0, _utils.toUnderscore)(value).toUpperCase().replace(/^_+|_+$/g, '');
}

function l_case_all(value) {
    return (0, _utils.toUnderscore)(value).toLowerCase().replace(/^_+|_+$/g, '');
}

function ucaseall(value) {
    return value.toUpperCase();
}

function lcaseall(value) {
    return value.toLowerCase();
}

function hbsHelpers(hbs) {
    hbs.registerHelper('ucase', ucase);
    hbs.registerHelper('lcase', lcase);
    hbs.registerHelper('u_case_all', u_case_all);
    hbs.registerHelper('l_case_all', l_case_all);
    hbs.registerHelper('ucaseall', ucaseall);
    hbs.registerHelper('lcaseall', lcaseall);

    return hbs;
}