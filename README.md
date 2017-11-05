# water-drop [![Build Status](https://travis-ci.org/anvk/water-drop.svg?branch=master)](https://travis-ci.org/anvk/water-drop)

> 💧 very easy to use multi-language scaffolding/boilerplate tool for creating code for your existing projects

## Idea
A growing big project might eventually require contributors to write different boilerplates/code templates to be used as a starting point for new modules. Most often those templates are files to copy-paste followed by few variable renamings to reflect new module's name. `water-drop` is a scaffolding/boilerplate tool which allows to create new code based on the provided existing templates written by anyone.

This tool was created keeping in mind the following conditions:

1. It has to work for multiple languages (Go, JavaScript, Python, etc).
2. It has to be **easy** to use. Nobody should go through pages of documentation or reading many lines of code in order to understand how this tool works.
3. It has to be **easy** to setup new templates to be used by everyone. (For this project `Handlebars` was picked as the main templating engine for its simplicity. You can read more on `Handlebars` templating [here](http://handlebarsjs.com/))

## Minimum Required Data for New Module (Idea)

Here is the list of the minimum information required in order to create new code based on the existing template:

1. **Type** type of the template to be used for a new module
1. **Name**
2. **Path** relative path where new module will reside inside of a bigger project codebase
3. **Content** content of the files being copy-pasted with an ability to do few name changes afterwards

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

## Available Commands

To init `water-drop` inside the folder. This command will generate a basic config file `water-drop.json` with templates configuration and `water-drop-templates/` folder where all template related files has to be placed.
```
$ water-drop --init
```

To find on how to use the tool
```
$ water-drop -h
```

To list all available templates
```
$ water-drop --list
```

To generate a new module with name `new_module_name` based on the template `new_module_type` with the template path `new_module_path`. What files are being copied over, how and what is the full path for the new module are detemined by configuration within `water-drop.json` file.
```
$ water-drop [-v] -t <new_module_type> -n <new_module_name> -p <new_module_path>
```

## Quick Start

This tool requires `water-drop.json` and `water-drop-templates/` folder to be present in the folder where this command is executed. The following command will create those items with a sample `example` configuration and template files.
```
$ water-drop --init
```

New basic config will be created with one template `example` which uses 2 steps to create a new module using `water-drop-templates/example/example.js`

```json
{
    "templates": {
        "example": {
            "steps": [
                { "cmd": "mkdir", "path": "{{projectPath}}/{{lcase _mName}}/{{_mPath}}" },
                {
                    "cmd": "cpf",
                    "what": "example.js",
                    "to": "{{projectPath}}/{{lcase _mName}}/{{_mPath}}/index.js"
                }
            ],

            "vars": {}
        }
    },
    "vars": {
        "projectPath": "../"
    },
    "_tFolder": "water-drop-templates",
    "_tOpenTag": "<%%",
    "_tCloseTag": "%%>"
}
```

```js
// example.js file

const {{u_case_all _mName}}_CONST = 'Hello from water-drop !';

function {{lcase _mName}}Func(arg) {
    console.log({{u_case_all _mName}}_CONST);
}

export default {{lcase _mName}}Func;
```

Run the following command to scaffold a new module
```
$ water-drop -t example -n MyModule -p /path
```

This command should create `myModule/path/index.js` . It will be created one folder up from where your `water-drop.json` is located (since one of the example steps use `projectPath` variable to define project location. This variable is not required. You can define and use any other variables)

More advanced steps and more template configurations could be specified within `water-drop.json`

## Template Creation Example

- Let's imagine our team need to create lots of new modules which have the same comment about MIT license.
- Let's imagine we need to include a constant file inside our new module
- Let's also imagine that our `water-drop` scripts located in the same path as our project.

#### Step 1 (add new config)

```js
{
    "templates": {
        ...
        "licensedCode": {
            "steps": [
                { "cmd": "mkdir", "path": "{{licensingProject}}/{{_mPath}}" },
                {
                    "cmd": "cpf",
                    "what": "licensedFile.js",
                    "to": "{{licensingProject}}/{{_mPath}}/{{lcase _mName}}.js"
                },
                {
                    "cmd": "cp",
                    "what": "constants.js",
                    "to": "{{licensingProject}}/{{_mPath}}/constants.js"
                }
            ],

            "vars": {
                "author": "Alexey Novak"
            }
        }
    },
    "vars": {
        ...
        "licensingProject": "./"
    },
    "_tFolder": "water-drop-templates",
    "_tOpenTag": "<%%",
    "_tCloseTag": "%%>"
}
```

#### Step 2 (Create related files for new template)

Create folder `water-drop-template/licensedCode/`

Create file `water-drop-template/licensedCode/licensedFile.js`

```js
// MIT © {{author}}

import * from './constants.js';

function {{ucase _mName}}() {

}

export default {{ucase _mName}};
```

Create file `water-drop-template/licensedCode/constants.js`

```js
const config = {
    VERSION: '1.0.0',

    // place your config files here
};

export default config;
```

#### Done

Run `$ water-drop -t licensedCode -n NewModule -p /ui/utils`

New folder `ui/utils/` should be generated in the same folder as `water-drop.json` config file.

With new file `ui/utils/constants.js` and modified `ui/utils/newModule.js`:
```js
// MIT © Alexey Novak

function NewModule() {

}

export default NewModule;
```

## Steps

### mkdir

```json
{ "cmd": "mkdir", "path": "some/folder/structure" }
```

| Property | Description | Can Use Templating
:---|:---|:---
| `mkdir` | New folder path. The whole folder tree will be created if does not exist. Path is relative to the folder where `water-drop` command is executed. | Yes |

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

## Future Improvements

1. There are no tests present for this project yet.
2. Step command which will be able to inject a line of code into another existing file "in a smart way".
3. Roll-back mechanism for any auto-generated content in case when there is an error during execution.
4. Ability to pre-parse and detect issues within the config prior steps execution.
5. More detailed logging to identify an exact problem when there is a failure.

## License

MIT license; see [LICENSE](./LICENSE).

(c) 2017 by Alexey Novak
