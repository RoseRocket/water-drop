import meow from 'meow';
import waterDrop from './';

const cli = meow(
    `
USAGE
    $ water-drop <command>

where <command> is one of:
    init, list, template, create, uninit

water-drop <command> -i     quick help on <command>

EXAMPLES
    $ water-drop init

    $ water-drop create myNewShinyModule -t exampleModule -p path/within/my/project -v

    $ water-drop list

    $ water-drop template mySecondShinyModule

    $ water-drop template moduleToRemove -d

    $ water-drop uninit
`,
    {
        alias: {
            t: 'type',
            n: 'name',
            p: 'path',
            v: 'verbose',
            d: 'delete',
            h: 'help',
            i: 'info',
        },
    }
);

waterDrop(cli.input, cli.flags);
