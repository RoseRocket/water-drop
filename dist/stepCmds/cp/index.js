'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cp = cp;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cp() {
    var stepOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var isVerbose = options.isVerbose;


    if (isVerbose) {
        console.log('\n');
        console.log(_chalk2.default.blueBright('Going to execute "cp" command'));
        console.log('\n');
    }
}