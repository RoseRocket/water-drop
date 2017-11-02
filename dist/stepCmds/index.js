'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mkdir = require('./mkdir');

var _cp = require('./cp');

var _cpf = require('./cpf');

var cmds = {
    mkdir: _mkdir.mkdir,
    cp: _cp.cp,
    cpf: _cpf.cpf
};

exports.default = cmds;