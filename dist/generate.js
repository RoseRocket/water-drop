'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = generate;
exports.parseCLIArgs = parseCLIArgs;
exports.preParseSteps = preParseSteps;
exports.createTemplate = createTemplate;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('../config/config.json');

var _config2 = _interopRequireDefault(_config);

var _stepCmds = require('./stepCmds');

var _stepCmds2 = _interopRequireDefault(_stepCmds);

var _utils = require('./utils/utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = require('minimist')(process.argv.slice(2));
var configVars = _config2.default.vars;
var templateType = argv.t,
    templateName = argv.n,
    templatePath = argv.p,
    helpArg = argv.h,
    verboseArg = argv.v;
function generate() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // Parse CLI args and be sure that they make sense
    if (!parseCLIArgs({ helpArg: helpArg, templateType: templateType, templateName: templateName, templatePath: templatePath }, Object.keys(_config2.default.templates))) {
        (0, _utils.hardExit)();
    }

    (0, _utils.happyLog)('I know this template ! --> ', _chalk2.default.yellow.bgBlue.bold(templateType));

    var templateConfig = _config2.default.templates[templateType];
    var _templateConfig$steps = templateConfig.steps,
        steps = _templateConfig$steps === undefined ? [] : _templateConfig$steps,
        templateVars = templateConfig.vars;

    // create HBS context

    var context = _extends({}, configVars, templateVars, { templateType: templateType, templateName: templateName, templatePath: templatePath });

    // Pre-parse steps to be sure config is alright before we start moving files around
    if (!preParseSteps(steps)) {
        (0, _utils.hardExit)();
    }

    // Start moving files around
    createTemplate({ context: context, steps: steps, isVerbose: verboseArg });

    (0, _utils.happyLog)('✨ ✨ ✨     The work is complete and the template was created!    ✨ ✨ ✨');
}

function parseCLIArgs() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var templateTypes = arguments[1];
    var helpArg = args.helpArg,
        templateType = args.templateType,
        templateName = args.templateName,
        templatePath = args.templatePath;


    if (helpArg) {
        console.log(_chalk2.default.blueBright('Usage: node app.js -t <template_type> -n <template_name> -p <path>'));
        console.log(_chalk2.default.blueBright('I know these templates: ', _chalk2.default.yellow.bgBlue.bold(templateTypes.join(' '))));
        console.log(_chalk2.default.blueBright('Example for name: ', _chalk2.default.yellow.bgBlue.bold('MyNewShinyModule')));
        console.log(_chalk2.default.blueBright('Example for path: ', _chalk2.default.yellow.bgBlue.bold('/admin/customers')));
        console.log(_chalk2.default.blueBright('Exiting...'));
        console.log('\n');

        return;
    }

    if (!templateType) {
        console.log(_chalk2.default.red('Uh oh. You forgot to specify <template_type>!'));
        console.log(_chalk2.default.red('Run: node app.js -h to find on how to use this tool'));
        console.log(_chalk2.default.red('I know these templates: ', _chalk2.default.yellow.bgRed.bold(templateTypes.join(' '))));
        console.log(_chalk2.default.red('Example for path: ', _chalk2.default.yellow.bgRed.bold('/admin/customers')));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');

        return;
    }

    if (!templateTypes.includes(templateType)) {
        console.log(_chalk2.default.red('Uh oh. I do not know this <template_type>!'));
        console.log(_chalk2.default.red('I only know these templates: ', _chalk2.default.yellow.bgRed.bold(templateTypes.join(' '))));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');

        return;
    }

    if (!templateName) {
        console.log(_chalk2.default.red('Uh oh. I need a <template_name> to work correctly!'));
        console.log(_chalk2.default.red('Run: node app.js -h to find on how to use this tool'));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');

        return;
    }

    if (!templatePath) {
        console.log(_chalk2.default.red('Uh oh. I need a <path> to work correctly!'));
        console.log(_chalk2.default.red('Run: node app.js -h to find on how to use this tool'));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');

        return;
    }

    return true;
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
                (0, _utils.hardExit)();
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
}