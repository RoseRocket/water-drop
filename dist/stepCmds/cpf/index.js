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

var utils = _interopRequireWildcard(_utils);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENCODING = 'utf8';
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

    var properWhatPath = ('templates/' + context.templateType + '/' + stepOptions.what).replace(/\/\//i, '/');
    var absoluteWhatPath = _path2.default.resolve(properWhatPath);

    if (isVerbose) {
        utils.happyLog('..Going to generate ' + absoluteToPath);
        utils.happyLog('..Based on ' + absoluteWhatPath);
    }

    var contents = void 0;
    try {
        contents = _fs2.default.readFileSync(absoluteWhatPath, ENCODING);
    } catch (error) {
        return '...."' + COMMAND + '" failed with ' + error;
    }

    var contentsTemplate = Handlebars.compile(contents);
    var properContent = contentsTemplate(context);

    properContent = properContent.replace(/{%/gi, '{{');
    properContent = properContent.replace(/%}/gi, '}}');

    try {
        _fs2.default.writeFileSync(absoluteToPath, properContent, ENCODING);
    } catch (error) {
        return '...."' + COMMAND + '" failed with ' + error;
    }

    if (isVerbose) {
        utils.happyLog('....Generated ' + absoluteToPath);
    }

    return;
}