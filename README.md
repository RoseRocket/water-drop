# water-drop [![Build Status](https://travis-ci.org/anvk/water-drop.svg?branch=master)](https://travis-ci.org/anvk/water-drop)

> 💧 very easy to use multi-language scaffolding/boilerplate tool for creating code for your existing projects

## Idea
A growing big project might eventually require contributors to write different boilerplates/code templates to be used as a starting point for new modules. Most often those templates are files to copy-paste followed by few variable renamings to reflect new module's name. `water-drop` is a scaffolding/boilerplate tool which allows to create new code based on the provided existing templates written by anyone.

This tool was created keeping in mind the following conditions:

1. It has to work for multiple languages (Go, JavaScript, Python, etc).
2. It has to be **easy** to use. Nobody should go through pages of documentation or reading many lines of code in order to understand how this tool works.
3. It has to be **easy** to setup new templates to be used by everyone. (For this project `Handlebars` was picked as the main templating engine for its simplicity. You can read more on `Handlebars` templating [here](http://handlebarsjs.com/))

## Installation

Global installation *(suggested)*
```
$ npm i -g water-drop
$ water-drop
```

Local installation
```
$ npm install water-drop
$ node_modules/.bin/water-drop
```

## Usage

```
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
```

## Template Creation Example

- Let's imagine our team need to create lots of new modules which have the same comment about MIT license.
- Let's imagine we need to include a constant file inside our new module.

#### Step 1 (Init water-drop in the folder with future templates)

```
$ cd /my/amazing/project/

$ water-drop init
```

#### Step 2 (Bootstrap new template)

```
$ water-drop template licensedCode
```

#### Step 3 (Modify auto-generated config)

modify `water-drop-templates/licensedCode/config.json` file

```js
{
    "steps": [
        { "cmd": "mkdir", "path": "{{myProjectPath}}/{{_mPath}}" },
        {
            "cmd": "cpf",
            "what": "licensedFile.js",
            "to": "{{myProjectPath}}/{{_mPath}}/{{lcase _mName}}.js"
        },
        {
            "cmd": "cp",
            "what": "constants.js",
            "to": "{{myProjectPath}}/{{_mPath}}/constants.js"
        }
    ],

    "vars": {
        "myProjectPath": "./",
        "author": "Alexey Novak"
    }
}
```

#### Step 4 (Add template files)

Create file `water-drop-template/licensedCode/__files/licensedFile.js`

```js
// MIT © {{author}}

import * from './constants.js';

function {{ucase _mName}}() {

}

export default {{ucase _mName}};
```

Create file `water-drop-template/licensedCode/__files/constants.js`

```js
const config = {
    VERSION: '1.0.0',

    // place your config files here
};

export default config;
```

#### Step 5 (Run water-drop to generate new module based on the template)

Run `$ water-drop create NewModule -t licensedCode -p /ui/utils -v`

New folder `ui/utils/` should be generated in the same folder as `water-drop.json` config file.

With new files `ui/utils/constants.js` and `ui/utils/newModule.js`

## Available 3 Config Steps

### mkdir

```json
{ "cmd": "mkdir", "path": "some/folder/structure" }
```

| Property | Description | Can Use Templating
:---|:---|:---
| `path` | New folder path. The whole folder tree will be created if does not exist. Path is relative to the folder where `water-drop` command is executed. | Yes |

### cp

```json
{
    "cmd": "cp",
    "what": "fileTemplate.txt",
    "to": "some/folder/structure/file.txt"
},
```

| Property | Description | Can Use Templating
:---|:---|:---
| `what` | Path to the file within `water-drop-template/<template_type>/` to be used for a file copy operation. | No |
| `to` | Path to where file will be copied over. Path is relative to the folder where `water-drop` command is executed. | Yes |

### cpf

```json
{
    "cmd": "cpf",
    "what": "fileTemplate.txt",
    "to": "some/folder/structure/file.txt"
},
```

| Property | Description | Can Use Templating
:---|:---|:---
| `what` | Path to the file within `water-drop-template/<template_type>/` to be used for a file copy operation. `water-drop` will apply templating to the content of the file to make changes on its content. | No |
| `to` | Path to where file will be copied over. Path is relative to the folder where `water-drop` command is executed. | Yes |

## Available (extra) Handlebar Helpers

| Helper | Description | Example
:---|:---|:---
| `ucase` | Uppercases first character | myModule -> MyModule |
| `lcase` | Lowercases first character | MyModule -> myModule |
| `ucaseall` | Uppercases the whole string | myModule -> MYMODULE |
| `lcaseall` | Lowercases the whole string | MyModule -> mymodule |
| `u_case_all` | Uppercases the whole string and also adds `_` character between each uppercase character | MyModule -> MY_MODULE |
| `l_case_all` | Lowercases the whole string and also adds `_` character between each uppercase character | MyModule -> my_module |

## Context

`Handlebars` uses context object for templating function. Context for each template consist of the following variables:

- All variables within **vars** property of the config withijn `water-drop.json` file
- All variables within **vars** property of the template configuration within `water-drop.json` file
- **_mType** - template type used to create new module (passed through CLI)
- **_mName** - new module name (passed through CLI)
- **_mPath** - path to the new module (passed through CLI)

Also some specific `water-drop` tool configuration which most of the times you do not need to modify:

- **_tFolder** - location of the folder with template files
- **_tOpenTag** - special open tag to be used for `cpf` command
- **_tCloseTag** - special close tag to be used for `cpf` command

## Limitation

It is very important to remember that `Handlebars` keeps `{{` and `}}` reserved for its template logic. Use `<%%` and `%%>` respectively in case when a template needs to preserve those tags.

Example:

```
style=<%% weight: 50px, height: 50px %%>

will be converted to

style={{ weight: 50px, height: 50px }}
```

Also you might face a problem when trying to replace a value within the object. Example:

```js
// some of my react code

object={this.props.{{lcase _mName}}}

// this would fail since Handlebars would not like those closing }}}
```

You will need to re-write it as

```
object={this.props.{{lcase _mName}} }
```

## Future Improvements

1. There are no tests present for this project yet.
2. Step command which will be able to inject a line of code into another existing file "in a smart way".
3. Roll-back mechanism for any auto-generated content in case when there is an error during execution.
4. Ability to pre-parse and detect issues within the config prior steps execution.
5. More detailed logging to identify an exact problem when there is a failure.

## License

MIT license; see [LICENSE](./LICENSE).

(c) 2017 by Alexey Novak
