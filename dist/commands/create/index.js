'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = create;
exports.preParseSteps = preParseSteps;
exports.createTemplate = createTemplate;
exports.parseCLIArgs = parseCLIArgs;
exports.help = help;

var _config = require('../../../config/config.json');

var _config2 = _interopRequireDefault(_config);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('../../utils/utils.js');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _stepCmds = require('../../stepCmds');

var _stepCmds2 = _interopRequireDefault(_stepCmds);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _uninit = require('../uninit');

var _uninit2 = _interopRequireDefault(_uninit);

var _template = require('../template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var name = options.name,
        _options$flags = options.flags,
        flags = _options$flags === undefined ? {} : _options$flags;


    if (!name || flags.help || flags.info) {
        return help();
    }

    try {
        // read config file
        var config = (0, _utils.getAppConfig)();
        if (!config) {
            return;
        }

        var configVars = config.vars;


        if (flags.help || !flags.type) {
            return help();
        }

        if (!config.templates.includes(flags.type)) {
            console.log(_chalk2.default.yellow('Uh oh. I do not know "' + flags.type + '" template.'));
            console.log(_chalk2.default.yellow('Abort...'));
            console.log('\n');

            return;
        }

        if (!flags.path) {
            return help();
        }

        (0, _utils.happyLog)('I know this 💧  template ! --> ', _chalk2.default.yellow.bgBlue.bold(flags.type));

        var moduleConfigPath = process.cwd() + '/' + config._tFolder + '/' + flags.type + '/config.json';
        var contents = _fsExtra2.default.readFileSync(moduleConfigPath, _config2.default.fileEncoding);

        var templateConfig = JSON.parse(contents);
        var _templateConfig$steps = templateConfig.steps,
            steps = _templateConfig$steps === undefined ? [] : _templateConfig$steps,
            templateVars = templateConfig.vars;

        // create HBS context

        var context = _extends({}, configVars, templateVars, {
            _mType: flags.type,
            _mName: name,
            _mPath: flags.path,
            _tFolder: config._tFolder,
            _tOpenTag: config._tOpenTag,
            _tCloseTag: config._tCloseTag
        });

        // Pre-parse steps to be sure config is alright before we start moving files around
        if (!preParseSteps(steps)) {
            return;
        }

        // Start moving files around
        if (!createTemplate({ context: context, steps: steps, isVerbose: flags.verbose })) {
            return;
        }

        (0, _utils.happyLog)('✨ ✨ ✨     The work is complete and your template was created!    ✨ ✨ ✨');
    } catch (error) {
        console.log(_chalk2.default.red('Failed to create module: "' + name + '" with error ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');
    }
}

function preParseSteps(steps) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = steps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var step = _step.value;
            var cmd = step.cmd;

            if (!cmd) {
                console.log(_chalk2.default.red('"cmd" is missing in step ' + JSON.stringify(step) + ' Please refer to the README to find how to define steps.'));
                console.log(_chalk2.default.red('Exiting...'));
                console.log('\n');

                return;
            }

            if (!_stepCmds2.default[cmd]) {
                console.log(_chalk2.default.red('Unknown "cmd" in step ' + JSON.stringify(step) + ' Please refer to the README to find how to define steps.'));
                console.log(_chalk2.default.red('Exiting...'));
                console.log('\n');

                return;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return true;
}

function createTemplate() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var steps = options.steps,
        _options$context = options.context,
        context = _options$context === undefined ? {} : _options$context,
        _options$isVerbose = options.isVerbose,
        isVerbose = _options$isVerbose === undefined ? false : _options$isVerbose;

    // run steps

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = steps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var step = _step2.value;
            var cmd = step.cmd;


            var stepFunction = _stepCmds2.default[cmd];

            if (isVerbose) {
                (0, _utils.happyLog)('Going to execute "' + cmd + '" command');
            }

            var error = stepFunction(step, context, { isVerbose: isVerbose });

            if (error) {
                console.log(_chalk2.default.red('There is an error in ' + JSON.stringify(step) + ':'));
                console.log(_chalk2.default.red('The error is ' + error + ':'));
                console.log(_chalk2.default.red('Exiting...'));
                console.log('\n');
                return;
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return true;
}

function parseCLIArgs() {
    var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var templateTypes = arguments[1];

    if (flags.help || !flags.type) {
        return help();
    }

    if (!templateTypes.includes(flags.type)) {
        console.log(_chalk2.default.yellow('Uh oh. I do not know "' + flags.type + '" template.'));
        console.log(_chalk2.default.yellow('Abort...'));
        console.log('\n');

        return;
    }

    if (!flags.name) {
        return help();
    }

    if (!flags.path) {
        return help();
    }

    return true;
}

function help() {
    console.log(_chalk2.default.white('\nUSAGE\n    $ water-drop create <moduleName>\n\nOPTIONS\n    -t, --type        Template type\n    -p, --path        Module path in a project tree\n    -v, --verbose     Make execution verbose to see what is happening\n\nEXAMPLES\n    $ water-drop create myNewShinyModule -t exampleModule -p path/within/my/project -v\n'));
}