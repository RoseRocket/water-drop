'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cpf = cpf;

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _hbsHelpers = require('../../utils/hbsHelpers.js');

var _hbsHelpers2 = _interopRequireDefault(_hbsHelpers);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../../utils/utils.js');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _config = require('../../../config/config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMAND = 'cpf';
var Handlebars = (0, _hbsHelpers2.default)(_handlebars2.default);

function cpf() {
    var stepOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var isVerbose = options.isVerbose;


    if (!stepOptions.what) {
        return '"' + COMMAND + '" is missing "what" property';
    }

    if (!stepOptions.to) {
        return '"' + COMMAND + '" is missing "to" property';
    }

    var toTemplate = Handlebars.compile(stepOptions.to);
    var properToPath = toTemplate(context).replace(/\/\//gi, '/');
    var absoluteToPath = _path2.default.resolve(properToPath);

    var properWhatPath = (context._tFolder + '/' + context._mType + '/__files/' + stepOptions.what).replace(/\/\//i, '/');
    var absoluteWhatPath = _path2.default.resolve(properWhatPath);

    if (isVerbose) {
        (0, _utils.happyLog)('..Going to generate ' + absoluteToPath);
        (0, _utils.happyLog)('..Based on ' + absoluteWhatPath);
    }

    var contents = void 0;
    try {
        contents = _fsExtra2.default.readFileSync(absoluteWhatPath, _config2.default.fileEncoding);
    } catch (error) {
        return '...."' + COMMAND + '" failed with ' + error;
    }

    var contentsTemplate = Handlebars.compile(contents);
    var properContent = contentsTemplate(context);

    var regexOpenTag = new RegExp(context._tOpenTag, 'gi');
    var regexCloseTag = new RegExp(context._tCloseTag, 'gi');

    properContent = properContent.replace(regexOpenTag, '{{');
    properContent = properContent.replace(regexCloseTag, '}}');

    try {
        _fsExtra2.default.writeFileSync(absoluteToPath, properContent, _config2.default.fileEncoding);
    } catch (error) {
        return '...."' + COMMAND + '" failed with ' + error;
    }

    if (isVerbose) {
        (0, _utils.happyLog)('....Generated ' + absoluteToPath);
    }

    return;
}