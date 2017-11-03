'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = run;
exports.checkIfConfigExists = checkIfConfigExists;
exports.generateInitConfig = generateInitConfig;
exports.parseCLIArgs = parseCLIArgs;
exports.preParseSteps = preParseSteps;
exports.createTemplate = createTemplate;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _stepCmds = require('./stepCmds');

var _stepCmds2 = _interopRequireDefault(_stepCmds);

var _utils = require('./utils/utils.js');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _waterDrop = require('../config/water-drop.json');

var _waterDrop2 = _interopRequireDefault(_waterDrop);

var _config = require('../config/config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = require('minimist')(process.argv.slice(2));
var templateType = argv.t,
    templateName = argv.n,
    templatePath = argv.p,
    helpArg = argv.h,
    verboseArg = argv.v,
    initArg = argv.init,
    listArg = argv.list;

// MAIN EXECUTION FUNCTION

function run() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    console.log('\n');

    // If init option was passed then we want to create initial structure
    if (initArg) {
        return generateInitConfig();
    }

    // First check that the folder where we execute water-drop has config file within
    if (!checkIfConfigExists()) {
        return;
    }

    // read config file
    var config = (0, _utils.getAppConfig)();
    if (!config) {
        return;
    }

    var configVars = config.vars;

    // Parse CLI args and be sure that they make sense

    if (!parseCLIArgs({ helpArg: helpArg, listArg: listArg, templateType: templateType, templateName: templateName, templatePath: templatePath }, Object.keys(config.templates))) {
        return;
    }

    (0, _utils.happyLog)('I know this 💧  template ! --> ', _chalk2.default.yellow.bgBlue.bold(templateType));

    var templateConfig = config.templates[templateType];
    var _templateConfig$steps = templateConfig.steps,
        steps = _templateConfig$steps === undefined ? [] : _templateConfig$steps,
        templateVars = templateConfig.vars;

    // create HBS context

    var context = _extends({}, configVars, templateVars, {
        _tType: templateType,
        _tName: templateName,
        _tPath: templatePath,
        _tFolder: config._tFolder,
        _tOpenTag: config._tOpenTag,
        _tCloseTag: config._tCloseTag
    });

    // Pre-parse steps to be sure config is alright before we start moving files around
    if (!preParseSteps(steps)) {
        return;
    }

    // Start moving files around
    if (!createTemplate({ context: context, steps: steps, isVerbose: verboseArg })) {
        return;
    }

    (0, _utils.happyLog)('✨ ✨ ✨     The work is complete and your template was created!    ✨ ✨ ✨');
}

function checkIfConfigExists() {
    var exists = _fsExtra2.default.existsSync((0, _utils.getAppConfigPath)());

    if (!exists) {
        console.log(_chalk2.default.red('Looks like the current folder does not have water-drop config file within.'));
        console.log(_chalk2.default.red('Run: "water-drop --init" to create basic config file and a template folder.'));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');
    }

    return exists;
}

function generateInitConfig() {
    try {
        var exampleFolder = process.cwd() + '/' + _waterDrop2.default._tFolder + '/example';
        var configFolder = _path2.default.resolve(__dirname + '/../config');

        _mkdirp2.default.sync(exampleFolder);
        _fsExtra2.default.copySync(configFolder + '/example.js', exampleFolder + '/example.js');
        _fsExtra2.default.copySync(configFolder + '/water-drop.json', (0, _utils.getAppConfigPath)());

        (0, _utils.happyLog)('💧     This folder has a water-drop config now. You can create templates now. Run "water-drop -h" to learn more.   💧');
    } catch (error) {
        console.log(_chalk2.default.red('Failed to create initial config with error: ' + error));
        console.log(_chalk2.default.red('Exiting...'));
        console.log('\n');
    }
}

function parseCLIArgs() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var templateTypes = arguments[1];
    var helpArg = args.helpArg,
        listArg = args.listArg,
        templateType = args.templateType,
        templateName = args.templateName,
        templatePath = args.templatePath;


    if (helpArg || !templateType) {
        console.log(_chalk2.default.blueBright('node app.js [-v] -t <template_type> -n <template_name> -p <path>'));
        console.log('\n');
        console.log(_chalk2.default.blueBright('node app.js --list (To see all available template types)'));
        console.log('\n');
        console.log(_chalk2.default.blueBright('water-drop found the following templates: ', _chalk2.default.yellow.bgBlue.bold(templateTypes.join(' '))));
        console.log(_chalk2.default.blueBright('Example for name: ', _chalk2.default.yellow.bgBlue.bold('MyNewShinyModule')));
        console.log(_chalk2.default.blueBright('Example for path: ', _chalk2.default.yellow.bgBlue.bold('/admin/customers')));
        console.log('\n');

        return;
    }

    if (listArg) {
        console.log(_chalk2.default.blueBright('Available templates: ', _chalk2.default.yellow.bgBlue.bold(templateTypes.join(' '))));
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