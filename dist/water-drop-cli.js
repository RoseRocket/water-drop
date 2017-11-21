'use strict';

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _meow2.default)('\nUSAGE\n    $ water-drop <command>\n\nwhere <command> is one of:\n    init, list, template, create, uninit\n\nwater-drop <command> -i     quick help on <command>\n\nEXAMPLES\n    $ water-drop init\n\n    $ water-drop create myNewShinyModule -t exampleModule -p path/within/my/project -v\n\n    $ water-drop list\n\n    $ water-drop template mySecondShinyModule\n\n    $ water-drop template moduleToRemove -d\n\n    $ water-drop uninit\n', {
    alias: {
        t: 'type',
        n: 'name',
        p: 'path',
        v: 'verbose',
        d: 'delete',
        h: 'help',
        i: 'info'
    }
});

(0, _2.default)(cli.input, cli.flags);