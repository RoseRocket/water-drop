'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _template = require('./template');

var _template2 = _interopRequireDefault(_template);

var _uninit = require('./uninit');

var _uninit2 = _interopRequireDefault(_uninit);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commands = {
    init: _init2.default,
    list: _list2.default,
    template: _template2.default,
    uninit: _uninit2.default,
    create: _create2.default
};

exports.default = commands;