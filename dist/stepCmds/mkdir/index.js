'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mkdir = mkdir;

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _hbsHelpers = require('../../utils/hbsHelpers.js');

var _hbsHelpers2 = _interopRequireDefault(_hbsHelpers);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../../utils/utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMAND = 'mkdir';
var Handlebars = (0, _hbsHelpers2.default)(_handlebars2.default);

function mkdir() {
    var stepOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var isVerbose = options.isVerbose;


    if (!stepOptions.path) {
        return '"' + COMMAND + '" is missing "path" property';
    }

    console.log('context', context);
    var pathTemplate = Handlebars.compile(stepOptions.path);
    var properPath = pathTemplate(context).replace(/\/\//gi, '/');
    var absolutePath = _path2.default.resolve(properPath);

    if (isVerbose) {
        (0, _utils.happyLog)('..Going to generate ' + absolutePath);
    }

    try {
        _mkdirp2.default.sync(properPath);
    } catch (error) {
        return '...."' + COMMAND + '" failed with ' + error;
    }

    if (isVerbose) {
        (0, _utils.happyLog)('....Generated ' + absolutePath);
    }
}